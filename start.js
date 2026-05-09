#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');

console.log('\n========================================');
console.log('   DSC-SA COMMUNITY HUB');
console.log('   Starting Development Server');
console.log('========================================\n');

// Check directories
console.log('[1] Checking project structure...');
if (!fs.existsSync(BACKEND_DIR)) {
  console.error('ERROR: backend folder not found');
  process.exit(1);
}
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error('ERROR: frontend folder not found');
  process.exit(1);
}
console.log('[OK] Backend and Frontend folders found\n');

// Check and install dependencies
const installDeps = (dir, name) => {
  return new Promise((resolve) => {
    const nodeModulesPath = path.join(dir, 'node_modules');
    
    if (fs.existsSync(nodeModulesPath)) {
      console.log(`[OK] ${name} dependencies already installed`);
      resolve();
      return;
    }

    console.log(`[INSTALLING] ${name} dependencies...`);
    const installCmd = `cd "${dir}" && npm install`;
    
    exec(installCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`\nERROR: ${name} installation failed`);
        console.error(stderr);
        process.exit(1);
      }
      console.log(`[OK] ${name} installed\n`);
      resolve();
    });
  });
};

// Run npm script
const runScript = (dir, name, script) => {
  console.log(`[*] Starting ${name}...`);
  const runCmd = `cd "${dir}" && npm run ${script}`;
  
  exec(runCmd, { stdio: 'inherit' }, (error) => {
    if (error) {
      console.error(`${name} exited with error:`, error);
    }
  });
};

// Main
(async () => {
  try {
    console.log('[2] Installing dependencies...\n');
    await installDeps(BACKEND_DIR, 'Backend');
    await installDeps(FRONTEND_DIR, 'Frontend');

    console.log('========================================');
    console.log('   STARTING SERVERS');
    console.log('========================================\n');
    console.log('Backend:  http://localhost:5000');
    console.log('Frontend: http://localhost:3000\n');
    console.log('Press Ctrl+C to stop all servers\n');

    // Start backend
    runScript(BACKEND_DIR, 'Backend', 'dev');
    
    // Start frontend after delay
    setTimeout(() => {
      runScript(FRONTEND_DIR, 'Frontend', 'dev');
    }, 3000);

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
})();
