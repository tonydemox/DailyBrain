import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createSession } from '../services/api';
import { useTasks } from '../context/TaskContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/home.css';

function Home() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { allTasks, activeTasks, refreshTasks } = useTasks();

    useEffect(() => {
        refreshTasks();
    }, []);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            await createSession(text);
            await refreshTasks();
            navigate('/dashboard');
        } catch (err) {
            console.error('Errore:', err);
        } finally {
            setLoading(false);
        }
    };

    const priorityLabel = { oggi: 'Alta', domani: 'Media', dopo: 'Bassa' };
    const categoryColor = {
        lavoro: '#0984e3',
        università: '#6c63ff',
        personale: '#00b894',
        altro: '#888888'
    };
    const categoryIcons = {
        lavoro: 'bi-briefcase',
        università: 'bi-mortarboard',
        personale: 'bi-person',
        altro: 'bi-grid'
    };

    const todayTasks = activeTasks.filter(t => t.priority === 'oggi');
    const categories = ['lavoro', 'università', 'personale', 'altro'];
    const categoryStats = categories.map(cat => ({
        name: cat,
        total: allTasks.filter(t => t.category === cat).length,
        done: allTasks.filter(t => t.category === cat && t.status === 'done').length,
    })).filter(c => c.total > 0);

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="home-title">Ciao, {user?.name}!</h2>
                    <p className="text-muted mb-0">Cosa vuoi fare oggi?</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-bell home-bell" />
                    <button className="btn btn-primary-custom px-4" onClick={handleSubmit} disabled={loading}>
                        <i className="bi bi-plus me-1" /> Nuova attività
                    </button>
                </div>
            </div>

            {/* Input card */}
            <div className="card border-0 shadow-sm p-4 mb-4">
        <textarea
            className="form-control home-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi qui cosa vuoi fare..."
            rows={3}
        />
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex gap-3">
                        <span className="home-filter"><i className="bi bi-calendar me-1" />Data</span>
                        <span className="home-filter"><i className="bi bi-flag me-1" />Priorità</span>
                        <span className="home-filter"><i className="bi bi-tag me-1" />Categoria</span>
                    </div>
                    <button
                        className="btn btn-primary-custom px-4 fw-semibold"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" />Analizzando...</>
                        ) : (
                            <><i className="bi bi-stars me-2" />Aggiungi</>
                        )}
                    </button>
                </div>
            </div>

            {/* Riga 1: Attività di oggi + Categorie */}
            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">
                                Le tue attività di oggi
                                <span className="badge rounded-pill ms-2 badge-count">{todayTasks.length}</span>
                            </h6>
                        </div>
                        {todayTasks.length === 0 ? (
                            <p className="text-muted text-center py-3">Nessuna attività urgente per oggi!</p>
                        ) : (
                            todayTasks.slice(0, 4).map(task => (
                                <div key={task._id} className="home-task-item d-flex align-items-center py-2 border-bottom">
                                    <input type="checkbox" className="form-check-input me-3" readOnly />
                                    <div className="flex-grow-1">
                                        <p className="mb-0 fw-semibold small">{task.text}</p>
                                        <span className={`small home-category-${task.category}`}>
                      ● {task.category}
                    </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                    <span className={`small fw-semibold home-priority-${task.priority === 'oggi' ? 'alta' : task.priority === 'domani' ? 'media' : 'bassa'}`}>
                      <i className="bi bi-flag-fill me-1" />
                        {priorityLabel[task.priority]}
                    </span>
                                        {task.deadline && (
                                            <span className="text-muted small">{task.deadline}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="mt-3">
              <span className="home-link" onClick={() => navigate('/dashboard')}>
                Vedi tutte le attività →
              </span>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-3">Le tue categorie</h6>
                        {categoryStats.length === 0 ? (
                            <p className="text-muted text-center py-3">Nessuna attività ancora!</p>
                        ) : (
                            categoryStats.map(cat => (
                                <div key={cat.name} className="project-card d-flex align-items-center gap-3">
                                    <div className={`project-icon ${cat.name}`}>
                                        <i className={`bi ${categoryIcons[cat.name]}`} style={{ color: categoryColor[cat.name] }} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fw-semibold small text-capitalize">{cat.name}</span>
                                            <span className="text-muted small">{cat.total} attività</span>
                                        </div>
                                        <div className="progress-bar-custom">
                                            <div
                                                className={`progress-fill ${cat.name}`}
                                                style={{ width: cat.total > 0 ? `${Math.round((cat.done / cat.total) * 100)}%` : '0%' }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-muted small">{cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0}%</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Panoramica */}
            <div className="row g-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm p-4">
                        <h6 className="fw-bold mb-3">Panoramica</h6>
                        <div className="row g-3">
                            <div className="col-3">
                                <div className="home-stat-card p-3 rounded">
                                    <i className="bi bi-check-circle text-success fs-4" />
                                    <h4 className="fw-bold mt-2 mb-0">{allTasks.length}</h4>
                                    <p className="text-muted small mb-0">Attività totali</p>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="home-stat-card p-3 rounded">
                                    <i className="bi bi-calendar-check text-primary fs-4" />
                                    <h4 className="fw-bold mt-2 mb-0">{allTasks.filter(t => t.status === 'done').length}</h4>
                                    <p className="text-muted small mb-0">Completate</p>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="home-stat-card p-3 rounded">
                                    <i className="bi bi-clock text-warning fs-4" />
                                    <h4 className="fw-bold mt-2 mb-0">{allTasks.filter(t => t.status === 'todo').length}</h4>
                                    <p className="text-muted small mb-0">In corso</p>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="home-stat-card p-3 rounded">
                                    <i className="bi bi-arrow-repeat text-danger fs-4" />
                                    <h4 className="fw-bold mt-2 mb-0">{allTasks.filter(t => t.status === 'rimandato').length}</h4>
                                    <p className="text-muted small mb-0">Rimandati</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
