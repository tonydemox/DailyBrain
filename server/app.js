const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const planRoutes = require('./routes/planRoutes');
const errorHandler = require('./middleware/errorHandler');
const validateRequest = require('./middleware/validateRequest');
const authMiddleware = require('./middleware/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.set('io', io);

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/sessions', authMiddleware, validateRequest, sessionRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/plan', authMiddleware, planRoutes);

app.use(errorHandler);

io.on('connection', (socket) => {
    console.log('✅ Client connesso:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`👤 Utente ${userId} nella sua stanza`);
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnesso:', socket.id);
    });
});

module.exports = { app, server, io };
