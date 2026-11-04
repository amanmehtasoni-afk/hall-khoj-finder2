const fs = require('fs');

const sql = fs.readFileSync('supabase/setup_complete_database.sql', 'utf8');

const parts = sql.split(/CREATE TABLE IF NOT EXISTS public\./i);
const tableConstraints = {};

for (let i = 1; i < parts.length; i++) {
  const p = parts[i];
  const tableName = p.split(/\s|\(/)[0].trim();
  const def = p.substring(0, p.indexOf(');'));
  tableConstraints[tableName] = {};
  
  const lines = def.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([a-zA-Z0-9_]+)[^,\n]*?CHECK\s*\((.*)\)\s*,?$/i);
    if (m) {
      const col = m[1];
      const checkExpr = m[2];
      const inM = checkExpr.match(/IN\s*\(([^)]+)\)/i);
      if (inM) {
        const allowed = inM[1].split(',').map(s => s.trim().replace(/^'|'$/g, ''));
        tableConstraints[tableName][col] = { type: 'IN', allowed };
      }
    }
  }
}

console.log('Detected table constraints:');
console.log(JSON.stringify(tableConstraints, null, 2));

// Parse every INSERT statement
const insertRegex = /INSERT INTO public\.([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([\s\S]*?)\)\s*ON CONFLICT/gi;
let insMatch;
let totalInserts = 0;
let errors = 0;
const checkedCounts = {};

while ((insMatch = insertRegex.exec(sql)) !== null) {
  totalInserts++;
  const table = insMatch[1];
  const cols = insMatch[2].split(',').map(c => c.trim());
  const valStr = insMatch[3];
  
  const vals = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < valStr.length; i++) {
    const c = valStr[i];
    if (c === "'" && (i === 0 || valStr[i-1] !== '\\')) {
      inQuote = !inQuote;
    } else if (c === ',' && !inQuote) {
      vals.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  vals.push(cur.trim());

  if (tableConstraints[table]) {
    for (const [col, rule] of Object.entries(tableConstraints[table])) {
      const colIdx = cols.indexOf(col);
      if (colIdx !== -1) {
        checkedCounts[table + '.' + col] = (checkedCounts[table + '.' + col] || 0) + 1;
        const rawVal = vals[colIdx];
        const val = rawVal ? rawVal.replace(/^'|'$/g, '') : null;
        if (rule.type === 'IN') {
          if (val && !rule.allowed.includes(val)) {
            console.error(`CONSTRAINT VIOLATION in table '${table}', column '${col}': value '${val}' is NOT IN [${rule.allowed.join(', ')}]`);
            errors++;
          }
        }
      }
    }
  }
}

console.log('\nChecked constraint value counts:', checkedCounts);
console.log(`\nVerified ${totalInserts} INSERT statements.`);
if (errors === 0) {
  console.log('SUCCESS: ZERO constraint violations found across all tables and rows!');
} else {
  console.error(`FAILURE: Found ${errors} constraint violations!`);
  process.exit(1);
}
