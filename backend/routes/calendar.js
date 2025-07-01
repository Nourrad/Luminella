const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../middleware/authMiddleware'); // 🔒 Firebase token auth

// 🔒 Protected: Save a calendar entry with Firebase UID
router.post('/', authenticate, async (req, res) => {
  const { productId, usageTime, notes } = req.body;
  const firebaseUid = req.user.uid;

  try {
    await db.query(
      'INSERT INTO calendar_entries (firebase_uid, product_id, usage_time, notes) VALUES ($1, $2, $3, $4)',
      [firebaseUid, productId, usageTime, notes]
    );
    res.status(201).json({ message: 'Calendar entry saved!' });
  } catch (err) {
    console.error('❌ Calendar Insert Error:', err.message);
    res.status(500).json({ error: 'Failed to save calendar entry' });
  }
});

// 🔒 Protected: Save calendar entry using product_name
router.post('/by-name', authenticate, async (req, res) => {
  const { product_name, usage_time } = req.body;
  const firebaseUid = req.user.uid;

  if (!product_name || !usage_time) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const result = await db.query(
      'SELECT id FROM products WHERE name = $1 LIMIT 1',
      [product_name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productId = result.rows[0].id;

    await db.query(
      'INSERT INTO calendar_entries (firebase_uid, product_id, usage_time) VALUES ($1, $2, $3)',
      [firebaseUid, productId, usage_time]
    );

    res.status(201).json({ message: 'Calendar entry saved by product name!' });
  } catch (err) {
    console.error('❌ Calendar Insert by Name Error:', err.message);
    res.status(500).json({ error: 'Failed to save entry by name' });
  }
});

// 🔒 Protected: Get entries for logged-in user
router.get('/:uid', authenticate, async (req, res) => {
  const requestedUid = req.params.uid;
  const tokenUid = req.user.uid;

  if (requestedUid !== tokenUid) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM calendar_entries WHERE firebase_uid = $1 ORDER BY usage_time',
      [tokenUid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Calendar Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch calendar entries' });
  }
});

// 🔒 DELETE /api/calendar/:entryId
router.delete('/:entryId', authenticate, async (req, res) => {
  const entryId = req.params.entryId;
  const firebaseUid = req.user.uid;

  try {
    const result = await db.query(
      'DELETE FROM calendar_entries WHERE id = $1 AND firebase_uid = $2',
      [entryId, firebaseUid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Entry not found or unauthorized' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete calendar entry' });
  }
});

module.exports = router;
