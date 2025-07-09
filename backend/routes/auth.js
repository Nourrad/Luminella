
// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const db = require('../db');
// const analyzeSkinType = require('../utils/skinAnalyzer');


// // Create user profile + save answers + analyze skin type
// router.post('/create-profile', async (req, res) => {
//   const { uid, email, name, age, gender, ...answers } = req.body;

//   try {
//     // 1. Analyze skin type
//     const skinType = analyzeSkinType(answers);

//     // 2. Insert user and get userId
//     const result = await db.query(
//       'INSERT INTO users (firebase_uid, email, name, birth_date, gender, skin_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
//       [uid, email, name, age, gender, skinType]
//     );
//     const userId = result.rows[0].id;

//     // 3. Insert answers
//     for (const [questionId, answer] of Object.entries(answers)) {
//       const value = Array.isArray(answer) ? answer.join(', ') : answer;
//       await db.query(
//         'INSERT INTO questionnaire_answers (user_id, question_id, answer) VALUES ($1, $2, $3)',
//         [userId, questionId, value]
//       );
//     }

//     // 4. Respond with skin type
//     res.status(201).json({ message: 'Profile created', skinType });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // ✅ Update user's concerns (PUT /api/auth/:userId/concerns)
// router.put('/:userId/concerns', async (req, res) => {
//   const { userId } = req.params;
//   const { concerns } = req.body;

//   if (!Array.isArray(concerns)) {
//     return res.status(400).json({ error: 'Concerns must be an array.' });
//   }

//   try {
//     await db.query('UPDATE users SET concerns = $1 WHERE firebase_uid = $2', [concerns, userId]);
//     res.json({ message: 'Concerns updated successfully.' });
//   } catch (err) {
//     console.error('Error updating concerns:', err);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });


// module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const analyzeSkinType = require('../utils/skinAnalyzer');

// ✅ Create or update user profile + save answers + analyze skin type
router.post('/create-profile', async (req, res) => {
  const { uid, email, name, age, gender, skinType, concerns = [], ...answers } = req.body;

  try {
    // 🔍 Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE firebase_uid = $1', [uid]);

    let userId;

    if (existing.rows.length > 0) {
      // ✅ Update existing user
      userId = existing.rows[0].id;

      await db.query(
        'UPDATE users SET email = $1, name = $2, birth_date = $3, gender = $4, skin_type = $5, concerns = $6 WHERE firebase_uid = $7',
        [email, name, age, gender, skinType, concerns, uid]
      );
    } else {
      // ✅ Create new user
      const result = await db.query(
        'INSERT INTO users (firebase_uid, email, name, birth_date, gender, skin_type, concerns) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [uid, email, name, age, gender, skinType, concerns]
      );
      userId = result.rows[0].id;
    }

    // ✅ Save questionnaire answers
    for (const [questionId, answer] of Object.entries(answers)) {
      const value = Array.isArray(answer) ? answer.join(', ') : answer;
      await db.query(
        'INSERT INTO questionnaire_answers (user_id, question_id, answer) VALUES ($1, $2, $3)',
        [userId, questionId, value]
      );
    }

    res.status(201).json({ message: 'Profile saved or updated', skinType });
  } catch (err) {
    console.error('❌ Error in /create-profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update user's concerns (PUT /api/auth/:userId/concerns)
router.put('/:userId/concerns', async (req, res) => {
  const { userId } = req.params;
  const { concerns } = req.body;

  if (!Array.isArray(concerns)) {
    return res.status(400).json({ error: 'Concerns must be an array.' });
  }

  try {
    await db.query('UPDATE users SET concerns = $1 WHERE firebase_uid = $2', [concerns, userId]);
    res.json({ message: 'Concerns updated successfully.' });
  } catch (err) {
    console.error('Error updating concerns:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
