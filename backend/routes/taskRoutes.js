const express = require('express');
const router = express.Router();
const { getTasks, getAllTasks, getPostponedTasks, getStatistics, updateTask, deleteTask } = require('../controllers/taskController');

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Ottieni i task attivi
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista dei task attivi
 */
router.get('/', getTasks);

/**
 * @swagger
 * /tasks/all:
 *   get:
 *     summary: Ottieni tutti i task
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista di tutti i task
 */
router.get('/all', getAllTasks);

/**
 * @swagger
 * /tasks/postponed:
 *   get:
 *     summary: Ottieni i task rimandati
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista dei task rimandati
 */
router.get('/postponed', getPostponedTasks);

/**
 * @swagger
 * /tasks/statistics:
 *   get:
 *     summary: Ottieni le statistiche dei task
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Statistiche dei task
 */
router.get('/statistics', getStatistics);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Aggiorna un task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [todo, done, rimandato]
 *     responses:
 *       200:
 *         description: Task aggiornato
 *       404:
 *         description: Task non trovato
 */
router.put('/:id', updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Elimina un task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task eliminato
 *       404:
 *         description: Task non trovato
 */
router.delete('/:id', deleteTask);

module.exports = router;