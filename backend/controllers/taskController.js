const mongoose = require('mongoose');
const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({
            userId: req.userId,
            status: { $nin: ['done', 'rimandato'] }
        }).sort({ priority: 1 });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

const getPostponedTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({
            userId: req.userId,
            status: 'rimandato'
        }).sort({ postponedCount: -1 });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

const getStatistics = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const filter = { userId };

        const total = await Task.countDocuments(filter);
        const completed = await Task.countDocuments({ ...filter, status: 'done' });
        const inProgress = await Task.countDocuments({ ...filter, status: 'todo' });
        const postponed = await Task.countDocuments({ ...filter, status: 'rimandato' });

        const byCategory = await Task.aggregate([
            { $match: { userId } },
            { $group: { _id: '$category', count: { $sum: 1 }, done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } } } }
        ]);

        const byPriority = await Task.aggregate([
            { $match: { userId } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        const byDay = await Task.aggregate([
            { $match: { userId, status: 'done' } },
            { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
            { $sort: { '_id': 1 } }
        ]);

        const productivity = await Task.aggregate([
            { $match: { userId, status: 'done' } },
            { $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }},
            { $sort: { '_id': 1 } },
            { $limit: 7 }
        ]);

        res.json({ total, completed, inProgress, postponed, byCategory, byPriority, byDay, productivity });
    } catch (err) {
        next(err);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const update = req.body;

        if (update.status === 'rimandato') {
            update.$inc = { postponedCount: 1 };
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.userId },
            update,
            { new: true }
        );

        if (!task) return res.status(404).json({ error: 'Task non trovato' });

        const io = req.app.get('io');
        io.to(req.userId.toString()).emit('task:updated', task);

        if (update.status === 'done') {
            io.to(req.userId.toString()).emit('notification', {
                message: `✅ Task completato: ${task.text}`
            });
        }

        res.json(task);
    } catch (err) {
        next(err);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) return res.status(404).json({ error: 'Task non trovato' });

        const io = req.app.get('io');
        io.to(req.userId.toString()).emit('task:deleted', req.params.id);

        res.json({ message: 'Task eliminato' });
    } catch (err) {
        next(err);
    }
};



module.exports = { getTasks, getAllTasks, updateTask, deleteTask, getPostponedTasks, getStatistics};


