import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';
import PostponedCard from '../components/TaskCard.jsx';
import '../styles/postponed.css';

function Postponed() {
    const { postponedTasks, loading, refreshTasks } = useTasks();
    const navigate = useNavigate();

    useEffect(() => {
        refreshTasks();
    }, []);

    if (loading) return <p className="p-4">Caricamento...</p>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center postponed-header">
                <div>
                    <h2 className="postponed-title">Attività rimandate</h2>
                    <p className="text-muted mb-0">{postponedTasks.length} attività rimandate</p>
                </div>
            </div>

            {postponedTasks.length === 0 ? (
                <div className="card border-0 shadow-sm postponed-empty">
                    <p className="mb-3">Nessuna attività rimandata!</p>
                    <button className="btn btn-primary-custom px-4" onClick={() => navigate('/')}>
                        Aggiungi attività
                    </button>
                </div>
            ) : (
                <div>
                    {postponedTasks.map(task => (
                        <PostponedCard key={task._id} task={task} onUpdate={refreshTasks} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Postponed;