// test_db.js
const db = require('./db');

db.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Database responded with:', res.rows);
  })
  .catch(err => {
    console.error('❌ DB connection error:', err.message);
    console.error('📛 Stack:', err.stack);
  });
