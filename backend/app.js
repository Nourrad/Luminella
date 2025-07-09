const express = require('express');
const cors = require('cors');
const scheduleRoutes = require('./routes/schedule');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const questionnaireRoutes = require('./routes/questionnaire');
const calendarRoutes = require('./routes/calendar');
const db = require('./db'); //added day4
// const userRoutes = require('./routes/user');


require('dotenv').config(); // Load .env variables

const app = express();

app.use(cors());
app.use(express.json());

// Log all incoming requestscd
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// Specific routes first
app.use('/api/products', productRoutes);
app.use('/api/schedule', scheduleRoutes);
console.log('✅Loading questionnaireRoutes...');
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/calendar', calendarRoutes);
// app.use('/api/user', userRoutes);



// generic `/api`
app.use('/api', authRoutes);


// const PORT = process.env.PORT || 5050; //this was the error of Day3 backend (5050 not 5000)

//Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ Connected to:', process.env.DATABASE_URL);
});