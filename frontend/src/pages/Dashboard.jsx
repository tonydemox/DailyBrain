import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateTask, deleteTask } from '../services/api';
import { useTasks } from '../context/TaskContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import '../styles/dashboard.css';

function Dashboard() {
    const { activeTasks, loading, refreshTasks } = useTasks();
    const navigate = useNavigate();

    useEffect(() => {
        refreshTasks();
    }, []);

    if (loading) return <p className="p-4">Caricamento...</p>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center dashboard-header">
                <div>
                    <h2 className="dashboard-title">Le tue attività di oggi 📋</h2>
                    <p className="text-muted mb-0">{activeTasks.length} attività rimanenti</p>
                </div>
                <button className="btn btn-primary-custom px-4" onClick={() => navigate('/')}>
                    + Nuova attività
                </button>
            </div>

            {activeTasks.length === 0 ? (
                <div className="card border-0 shadow-sm dashboard-empty">
                    <p className="mb-3">🎉 Nessun task per oggi!</p>
                    <button className="btn btn-primary-custom px-4" onClick={() => navigate('/')}>
                        Aggiungi attività
                    </button>
                </div>
            ) : (
                <div>
                    {activeTasks.map(task => (
                        <TaskCard key={task._id} task={task} onUpdate={refreshTasks} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;