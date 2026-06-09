const express = require('express');
const router = express.Router();
const { createSession, getSessions } = require('../controllers/sessionController');

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Crea una nuova sessione e analizza il testo con AI
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 example: "domani esame matematica, devo rispondere al prof"
 *     responses:
 *       200:
 *         description: Sessione creata e task estratti
 */
router.post('/', createSession);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Ottieni tutte le sessioni
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Lista delle sessioni
 */
router.get('/', getSessions);

module.exports = router;