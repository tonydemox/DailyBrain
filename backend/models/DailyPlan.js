const mongoose = require('mongoose');

const DailyPlanSchema = new mongoose.Schema({
    date: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyPlan', DailyPlanSchema);