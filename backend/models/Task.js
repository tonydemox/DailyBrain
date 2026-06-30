const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    text: { type: String, required: true },
    priority: { type: String, enum: ['oggi', 'domani', 'dopo'], default: 'oggi' },
    status: { type: String, enum: ['todo', 'done', 'rimandato'], default: 'todo' },
    category: { type: String, enum: ['lavoro', 'università', 'personale', 'altro'], default: 'altro' },
    deadline: { type: String, default: null },
    postponedCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);