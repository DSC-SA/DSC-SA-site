const fs = require('fs');
const path = require('path');

const frontendDistPath = path.join(__dirname, '../frontend/dist');
const backendPublicPath = path.join(__dirname, '../backend/public');

// Create backend/public if it doesn't exist
if (!fs.existsSync(backendPublicPath)) {
  fs.mkdirSync(backendPublicPath, { recursive: true });
  console.log('✓ Created backend/public directory');
}

// Copy frontend dist to backend public
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log('⚠ Frontend dist folder not found. Skipping copy.');
    return;
  }

  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(`✓ Copied frontend build to backend/public`);
}

copyDir(frontendDistPath, backendPublicPath);
