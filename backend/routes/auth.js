const express = require('express');
const router = express.Router();
const db = require('../db');
const analyzeSkinType = require('../utils/skinAnalyzer');


// ✅ Create user profile + save answers + analyze skin type
router.post('/create-profile', async (req, res) => {
  const { uid, email, name, age, gender, ...answers } = req.body;

  try {
    // 1. Analyze skin type
    const skinType = analyzeSkinType(answers);

    // 2. Insert user and get userId
    const result = await db.query(
      'INSERT INTO users (firebase_uid, email, name, birth_date, gender, skin_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [uid, email, name, age, gender, skinType]
    );
    const userId = result.rows[0].id;

    // 3. Insert answers
    for (const [questionId, answer] of Object.entries(answers)) {
      const value = Array.isArray(answer) ? answer.join(', ') : answer;
      await db.query(
        'INSERT INTO questionnaire_answers (user_id, question_id, answer) VALUES ($1, $2, $3)',
        [userId, questionId, value]
      );
    }

    // 4. Respond with skin type
    res.status(201).json({ message: 'Profile created', skinType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
