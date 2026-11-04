const fs = require('fs');
const content = fs.readFileSync('supabase/setup_complete_database.sql', 'utf8');

function checkValues(table, colName) {
  const matches = content.matchAll(new RegExp('INSERT INTO public\\.' + table + '\\s*\\(([^)]+)\\)\\s*VALUES\\s*\\(([\\s\\S]*?)\\)\\s*ON CONFLICT', 'gi'));
  const values = new Set();
  for (const m of matches) {
    const cols = m[1].split(',').map(s => s.trim());
    const idx = cols.indexOf(colName);
    if (idx !== -1) {
      const valStr = m[2];
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
      if (vals[idx]) values.add(vals[idx].replace(/^'|'$/g, ''));
    }
  }
  console.log(table, colName, '-> values found:', Array.from(values));
}

checkValues('owners', 'verification_status');
checkValues('venues', 'status');
checkValues('venues', 'type');
checkValues('bookings', 'status');
checkValues('bookings', 'time_slot');
checkValues('payments', 'payment_status');
checkValues('transactions', 'status');
checkValues('transactions', 'type');
checkValues('support_tickets', 'status');
checkValues('profiles', 'account_status');
checkValues('user_roles', 'role');
