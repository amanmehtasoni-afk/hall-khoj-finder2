const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace style attributes
  content = content.replace(/style=["']([^"']*)["']/gi, (match, styleBody) => {
    // If style contains background: linear-gradient or background: # (colored background), keep color
    const hasColoredBg = /background(-color)?\s*:\s*(linear-gradient|#[0-9a-fA-F]{3,8}|rgba?\((?!(255,\s*255,\s*255|0,\s*0,\s*0|transparent)))/i.test(styleBody);
    if (hasColoredBg) {
      return match;
    }

    // Replace color: #fff or color: white or color: #ffffff
    const updatedStyle = styleBody.replace(/\bcolor\s*:\s*(#fff\b|#ffffff\b|white\b)(\s*!important)?/gi, 'color:var(--text-primary)$2');
    if (updatedStyle !== styleBody) {
      return `style="${updatedStyle}"`;
    }
    return match;
  });

  // Also replace inside <style> blocks if someone wrote hardcoded color:#fff without theme scoping
  content = content.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (match, cssBody) => {
    // In style tags, replace color: #ffffff or color: #fff on headings or text selectors
    let updatedCss = cssBody.replace(/(\b(?:h[1-6]|\.title|\.heading|\.label|strong|label|p)\s*\{[^}]*?)color\s*:\s*(#fff\b|#ffffff\b|white\b)/gi, '$1color: var(--text-primary)');
    if (updatedCss !== cssBody) {
      return match.replace(cssBody, updatedCss);
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(frontendDir, filePath)}`);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (entry.name.endsWith('.html')) {
      processHtmlFile(full);
    }
  }
}

console.log('Replacing remaining hardcoded white styles in all HTML files...');
walkDir(frontendDir);
console.log('Done!');
