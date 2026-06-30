const express = require('express');
const router = express.Router();
const { getDailyPlan } = require('../controllers/planController');

router.get('/', getDailyPlan);

module.exports = router;

