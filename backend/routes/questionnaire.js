
// // backend/routes/questionnaire.js
// const express = require('express');
// const router = express.Router();
// const db = require('../db');

// router.post('/', async (req, res) => {
//     console.log('✅ questionnaire.js is loaded');

//   const { userId, answers } = req.body;

//   console.log('📩 Incoming POST /api/questionnaire');
//   console.log('🧪 userId:', userId);
//   console.log('🧪 answers:', answers);

//   console.log('📦 JSON.stringify(answers):', JSON.stringify(answers));

//   try {
//     const result = await db.query(
//       'INSERT INTO questionnaire_answers (user_id, answers) VALUES ($1, $2::jsonb)',
//       [userId, JSON.stringify(answers)]
//     );
//     console.log('✅ Inserted successfully:', result.rowCount);
//     res.status(201).json({ message: 'Questionnaire answers saved!' });
//   } catch (error) {
//     console.error('❌ DB Error:', error.message);
//     console.error('📛 Stack:', error.stack);
//     res.status(500).json({ error: 'Failed to save questionnaire answers' });
//   }
// });

// module.exports = router;

// backend/routes/questionnaire.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { userId, answers } = req.body;

  try {
    console.log('➡️ POST /api/questionnaire');
    console.log('🧪 userId:', userId);
    console.log('🧪 answers:', answers);

    // 👇 CHECK what database you are connected to
    const dbNameResult = await db.query('SELECT current_database()');
    console.log('🧠 Connected to DB:', dbNameResult.rows[0].current_database);

    // 👇 Actual INSERT query
    const result = await db.query(
      'INSERT INTO questionnaire_answers (user_id, answers) VALUES ($1, $2::jsonb)',
      [userId, JSON.stringify(answers)]
    );

    console.log('✅ Insert success:', result.rowCount);
    res.status(201).json({ message: 'Questionnaire answers saved!' });

  } catch (error) {
    console.error('❌ DB Error:', error.message);
    console.error('📛 Full Error:', error);
    res.status(500).json({ error: 'Insert failed!' });
  }
});

module.exports = router;
