const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/color\s*:\s*(#fff\b|#ffffff\b|white\b)/i.test(line)) {
          // Ignore if it has colored background (like avatar, button, badge)
          const isButtonOrAvatar = /background(-color)?\s*:\s*(linear-gradient|#[0-9a-fA-F]{3,8}|rgba?\((?!(255,\s*255,\s*255|0,\s*0,\s*0|transparent)))/i.test(line) ||
            /btn-|badge-|pin-|avatar/i.test(line);
          if (!isButtonOrAvatar) {
            console.log(`${path.relative(frontendDir, fullPath)}:${idx + 1} -> ${line.trim().substring(0, 110)}`);
          }
        }
      });
    }
  }
}

console.log('=== REMAINING INLINE WHITE TEXT COLOR REPORT ===');
scanDir(frontendDir);
