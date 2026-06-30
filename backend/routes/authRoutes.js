const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Antonio
 *               email:
 *                 type: string
 *                 example: antonio@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Utente registrato con successo
 *       400:
 *         description: Email già registrata
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Accedi con email e password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: antonio@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *       400:
 *         description: Email o password errati
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rinnova l'access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token rinnovato con successo
 *       401:
 *         description: Refresh token non valido
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Effettua il logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout effettuato
 */
router.post('/logout', authMiddleware, logout);

module.exports = router;