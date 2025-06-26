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

router.get('/test', async (req, res) => {
  console.log('🎯 /api/products/test route was hit');
  res.json({ message: 'Test successful!' });
});

module.exports = router;
