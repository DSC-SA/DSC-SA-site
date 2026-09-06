const pool = require('../config/database');

// Bundled fallback meta (current-meta heroes known to exist in the DB roster).
// Used only when the live source is unreachable AND the meta cache is empty.
const FALLBACK_META = [
  'Khufra', 'Lancelot', 'Beatrix', 'Kagura', 'Estes', 'Arlott', 'Chou', 'Fanny', 'Gusion', 'Grock'
];

const LIVE_SOURCES = [
  {
    name: 'arena.rone.dev',
    url: 'https://arena.rone.dev/api/heroes/rank?days=7&rank=glory&sort_field=ban_rate&sort_order=desc&size=60'
  },
  {
    name: 'arena.rone.dev-mythic',
    url: 'https://arena.rone.dev/api/heroes/rank?days=7&rank=mythic&sort_field=ban_rate&sort_order=desc&size=60'
  }
];

const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;

const fetchLive = async (url, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'dsc-sa-community-site/1.0' },
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json || json.code !== 0 || !json.data || !Array.isArray(json.data.records)) {
      throw new Error('Unexpected live meta payload');
    }
    return json.data.records;
  } finally {
    clearTimeout(timer);
  }
};

const parseRecords = (records) =>
  records
    .map((record, i) => {
      const d = record && record.data;
      if (!d || !d.main_hero || !d.main_hero.data || !d.main_hero.data.name) return null;
      const name = d.main_hero.data.name.trim();
      const pct = (v) => Math.round((Number(v) || 0) * 10000) / 100;
      return {
        name,
        win_rate: pct(d.main_hero_win_rate),
        ban_rate: pct(d.main_hero_ban_rate),
        pick_rate: pct(d.main_hero_appearance_rate),
        head_url: d.main_hero.data.head || null,
        sort_order: i
      };
    })
    .filter(Boolean);

const upsertMeta = async (entries, source) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM meta_heroes');
    for (const entry of entries) {
      await client.query(
        `INSERT INTO meta_heroes (name, win_rate, ban_rate, pick_rate, head_url, sort_order, source, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
        [entry.name, entry.win_rate, entry.ban_rate, entry.pick_rate, entry.head_url, entry.sort_order, source]
      );
    }
    await client.query('COMMIT');
    return entries.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const seedFallback = async () => {
  const entries = FALLBACK_META.map((name, i) => ({
    name,
    win_rate: null,
    ban_rate: null,
    pick_rate: null,
    head_url: null,
    sort_order: i
  }));
  await upsertMeta(entries, 'bundled-fallback');
  return entries.length;
};

const refreshMeta = async () => {
  let lastError = null;

  for (const source of LIVE_SOURCES) {
    try {
      console.log(`[meta] fetching ${source.name}...`);
      const records = await fetchLive(source.url);
      const entries = parseRecords(records);
      if (entries.length === 0) continue;
      const count = await upsertMeta(entries, source.name);
      console.log(`[meta] cached ${count} heroes from ${source.name}`);
      return { cache: count, source: source.name, stale: false };
    } catch (err) {
      lastError = err;
      console.error(`[meta] source ${source.name} failed: ${err.message}`);
    }
  }

  // All live sources failed — keep existing cache; seed fallback only if empty
  const existing = await pool.query('SELECT COUNT(*)::int AS n FROM meta_heroes');
  if (existing.rows[0].n === 0) {
    const count = await seedFallback();
    console.log(`[meta] live sources unavailable; seeded fallback (${count} heroes)`);
    return { cache: count, source: 'bundled-fallback', stale: true };
  }

  const lastRow = await pool.query('SELECT MAX(updated_at) AS t FROM meta_heroes');
  console.log(`[meta] live sources unavailable; keeping cached snapshot from ${lastRow.rows[0].t}`);
  return { cache: existing.rows[0].n, source: 'cache', stale: true, error: lastError ? lastError.message : undefined };
};

const getMeta = async () => {
  const result = await pool.query(
    'SELECT name, win_rate, ban_rate, pick_rate, head_url, sort_order, source, updated_at FROM meta_heroes ORDER BY sort_order ASC'
  );
  return result.rows;
};

module.exports = { refreshMeta, getMeta, FALLBACK_META, REFRESH_INTERVAL_MS };