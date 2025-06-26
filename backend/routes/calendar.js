const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Existing: Save a calendar entry with productId
router.post('/', async (req, res) => {
  const { userId, productId, usageTime, notes } = req.body;
  try {
    await db.query(
      'INSERT INTO calendar_entries (user_id, product_id, usage_time, notes) VALUES ($1, $2, $3, $4)',
      [userId, productId, usageTime, notes]
    );
    res.status(201).json({ message: 'Calendar entry saved!' });
  } catch (err) {
    console.error('❌ Calendar Insert Error:', err.message);
    res.status(500).json({ error: 'Failed to save calendar entry' });
  }
});

// ✅ New: Save calendar entry using product_name (frontend support)
router.post('/by-name', async (req, res) => {
  const { userId, product_name, usage_time } = req.body;
  if (!userId || !product_name || !usage_time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // First, get productId from name (assuming you have a products table)
    const result = await db.query(
      'SELECT id FROM products WHERE name = $1 LIMIT 1',
      [product_name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productId = result.rows[0].id;

    await db.query(
      'INSERT INTO calendar_entries (user_id, product_id, usage_time) VALUES ($1, $2, $3)',
      [userId, productId, usage_time]
    );

    res.status(201).json({ message: 'Calendar entry saved by product name!' });
  } catch (err) {
    console.error('❌ Calendar Insert by Name Error:', err.message);
    res.status(500).json({ error: 'Failed to save entry by name' });
  }
});

// Get entries for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM calendar_entries WHERE user_id = $1 ORDER BY usage_time',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Calendar Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch calendar entries' });
  }
});

module.exports = router;
