// const express = require('express');
// const router = express.Router();
// const db = require('../db');

// router.get('/:skinType', async (req, res) => {
//   const { skinType } = req.params;

//   try {
//     console.log('Requested skin type:', skinType); // 👈 NEW

//     const result = await db.query(
//       'SELECT * FROM products WHERE $1::text = ANY(suitable_for)',
//       [skinType]
//     );

//     console.log('Query result:', result.rows); // 👈 NEW
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not fetch products' });
//   }
// });

// module.exports = router;

// backend/routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');

console.log('✅ products.js is loaded');

router.get('/:category/:skinType', async (req, res) => {
  const { category, skinType } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM products 
       WHERE LOWER(category) = LOWER($1) 
       AND $2 = ANY(suitable_for)`,
      [category, skinType]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching filtered products:', err.message);
    res.status(500).json({ error: 'Failed to fetch filtered products' });
  }
});

module.exports = router;
