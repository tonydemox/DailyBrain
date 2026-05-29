const express = require('express');
const router = express.Router();
const { getTasks, getAllTasks, getPostponedTasks, getStatistics, updateTask, deleteTask } = require('../controllers/taskController');


router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/all', getAllTasks);
router.get('/postponed', getPostponedTasks);
router.get('/statistics', getStatistics);

module.exports = router;