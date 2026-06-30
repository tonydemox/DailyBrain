const { generateDailyPlan } = require('../services/plannerService');

const getDailyPlan = async (req, res, next) => {
    try {
        const plan = await generateDailyPlan();
        res.json(plan);
    }catch (err) {
        next(err);
    }
};

module.exports = { getDailyPlan };