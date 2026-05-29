const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const planRoutes = require('./routes/planRoutes');
const errorHandler = require('./middleware/errorHandler');
const validateRequest = require('./middleware/validateRequest');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', authMiddleware, validateRequest, sessionRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/plan', authMiddleware, planRoutes);

app.use(errorHandler);

module.exports = app;
