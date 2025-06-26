const express = require('express');
const router = express.Router();
const db = require('../db');

// // ✅ Add this test route
// console.log('Schedule routes loaded');

// router.get('/test', (req, res) => {
//   res.send('✅ Schedule route works!');
// });

router.post('/', async (req, res) => {
  const { userId, productId, usage_time } = req.body;

  try {
    await db.query(
      'INSERT INTO calendar_entries (user_id, product_id, usage_time) VALUES ($1, $2, $3)',
      [userId, productId, usage_time]
    );
    res.status(201).json({ message: 'Schedule saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save schedule' });
  }
});

module.exports = router;
