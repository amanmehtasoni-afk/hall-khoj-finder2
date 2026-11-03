const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

let totalReplacements = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(path.join(frontendDir, file), 'utf8');
  let original = content;

  // Replace style attributes where color is white and there is NO colored background
  content = content.replace(/style=["']([^"']*)["']/gi, (match, styleBody) => {
    // If style contains background: linear-gradient or background: # (colored background), keep color
    const hasColoredBg = /background(-color)?\s*:\s*(linear-gradient|#[0-9a-fA-F]{3,8}|rgba?\((?!(255,\s*255,\s*255|0,\s*0,\s*0|transparent)))/i.test(styleBody);
    if (hasColoredBg) {
      return match;
    }

    // Replace color: #fff or color: white or color: #ffffff
    const updatedStyle = styleBody.replace(/\bcolor\s*:\s*(#fff\b|#ffffff\b|white\b)/gi, 'color:var(--text-primary)');
    if (updatedStyle !== styleBody) {
      totalReplacements++;
      return `style="${updatedStyle}"`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(path.join(frontendDir, file), content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log(`Total inline white styles converted to var(--text-primary): ${totalReplacements}`);
