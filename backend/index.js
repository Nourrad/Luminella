// ==== luminella/backend/index.js.  ====
const express = require('express');
const cors = require('cors');
// const { Configuration, OpenAIApi } = require('openai');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
