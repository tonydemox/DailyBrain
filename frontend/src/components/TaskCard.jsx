import { updateTask, deleteTask } from '../services/api';
import '../styles/taskcard.css';

function TaskCard({ task, onUpdate }) {
    const handleComplete = async () => {
        await updateTask(task._id, { status: 'done' });
        onUpdate();
    };

    const handlePostpone = async () => {
        await updateTask(task._id, { status: 'rimandato' });
        onUpdate();
    };

    const handleDelete = async () => {
        await deleteTask(task._id);
        onUpdate();
    };

    return (
        <div className="task-card d-flex align-items-center gap-3">
            <div className={`priority-dot ${task.priority}`} />

            <div className="flex-grow-1">
                <p className="mb-1 fw-semibold">{task.text}</p>
                <div className="d-flex align-items-center gap-2">
                    <span className={`badge-category ${task.category}`}>{task.category}</span>
                    {task.deadline && <span className="text-muted small">📅 {task.deadline}</span>}
                    <span className="badge-priority">{task.priority}</span>
                </div>
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-sm btn-complete" onClick={handleComplete}>✓</button>
                <button className="btn btn-sm btn-postpone" onClick={handlePostpone}>⏭</button>
                <button className="btn btn-sm btn-delete" onClick={handleDelete}>🗑</button>
            </div>
        </div>
    );
}

export default TaskCard;