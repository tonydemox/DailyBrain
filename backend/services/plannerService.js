const Task = require('../models/Task');
const DailyPlan = require('../models/DailyPlan');

const generateDailyPlan = async () => {
    const today = new Date().toISOString().split('T')[0];

    const existingPlan = await DailyPlan.findOne({ date: today });
    if (existingPlan) return existingPlan;

    const tasks = await Task.find({ status: { $ne: 'fatto' } })
        .sort({ postponedCount: -1, priority: 1 })
        .limit(5);

    const plan = new DailyPlan({
        date: today,
        tasks: tasks.map(t => t._id)
    });

    await plan.save();
    return plan.populate('tasks');
};

module.exports = { generateDailyPlan };