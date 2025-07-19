// ==== luminella/backend/index.js ====
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();         // FIRST: create app
app.use(cors());               // THEN: use cors
app.use(express.json());

const openai = new OpenAI({
  apiKey: 'postgres://Nour@localhost:5432/lumenilla'
});

app.post('/api/gpt', async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('GPT Error:', error);
    res.status(500).json({ reply: 'Sorry, something went wrong.' });
  }
});

app.listen(5000, () => console.log('✅ Backend running at http://localhost:5000'));
