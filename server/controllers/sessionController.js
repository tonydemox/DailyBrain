const Session = require('../models/Session');
const Task = require('../models/Task');
const { analyzeText } = require('../services/claudeService');

const createSession = async (req, res, next) => {
    try {
        const { text } = req.body;

        const session = new Session({ originalText: text });
        await session.save();

        const extractedTasks = await analyzeText(text);

        const savedTasks = await Promise.all(
            extractedTasks.map(async (taskData) => {
                const task = new Task({ ...taskData, session: session._id, userId: req.userId });
                await task.save();
                return task;
            })
        );

        session.tasks = savedTasks.map(t => t._id);
        await session.save();

        res.json({  session, tasks: savedTasks });
    }catch (err) {
        next(err);
    }
};

const getSessions = async (req, res, next) => {
    try {
        const sessions = await Session.find().populate('tasks').sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) {
        next(err);
    }
};

module.exports = { createSession, getSessions };