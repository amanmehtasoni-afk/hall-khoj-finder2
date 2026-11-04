const fs = require('fs');

function inspectDash(file, label) {
  const content = fs.readFileSync(file, 'utf8');
  const fns = content.match(/function\s+([a-zA-Z0-9_]+)\s*\(/g) || [];
  const idMatches = content.match(/id="([^"]+)"/g) || [];
  const ids = idMatches.map(m => m.replace('id="', '').replace('"', ''));

  console.log(`\n========================================`);
  console.log(`${label}: ${file}`);
  console.log(`========================================`);
  console.log('Functions:', fns.slice(0, 20));
  console.log('Tab/View IDs:', ids.filter(i => i.startsWith('tab-') || i.startsWith('view-') || i.startsWith('section-') || i.includes('overview') || i.includes('calendar') || i.includes('analytics') || i.includes('booking') || i.includes('enquir') || i.includes('listing')));
}

inspectDash('frontend/owner/dashboard.html', 'Vendor Dashboard');
inspectDash('frontend/admin/dashboard.html', 'Super Admin Dashboard');
