import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext.jsx';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';
import '../styles/statistics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

function Statistics() {
    const { statistics, loading, refreshTasks } = useTasks();

    useEffect(() => {
        refreshTasks();
    }, []);

    if (loading) return <p className="p-4">Caricamento...</p>;
    if (!statistics) return <p className="p-4">Nessun dato disponibile.</p>;

    const stats = statistics;

    // resto del codice rimane uguale...

    // Dati grafico a barre per giorno
    const dayData = {
        labels: days,
        datasets: [{
            label: 'Task completati',
            data: days.map((_, i) => {
                const found = stats.byDay.find(d => d._id === i + 1);
                return found ? found.count : 0;
            }),
            backgroundColor: '#6c63ff',
            borderRadius: 6,
        }]
    };

    // Dati grafico a torta per priorità
    const priorityData = {
        labels: ['Alta', 'Media', 'Bassa'],
        datasets: [{
            data: [
                stats.byPriority.find(p => p._id === 'oggi')?.count || 0,
                stats.byPriority.find(p => p._id === 'domani')?.count || 0,
                stats.byPriority.find(p => p._id === 'dopo')?.count || 0,
            ],
            backgroundColor: ['#ff4757', '#ffa502', '#2ed573'],
            borderWidth: 0,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    };

    const doughnutOptions =  {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            }
        },
        cutout: '65%',
    };

    const productivityData = {
        labels: stats.productivity.map(p => p._id),
        datasets: [{
            label: 'Task completati',
            data: stats.productivity.map(p => p.count),
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108, 99, 255, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#6c63ff',
            fill: true,
            tension: 0.4,
        }]
    };

    const lineOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="statistics-header">
                <h2 className="statistics-title">Statistiche</h2>
                <p className="text-muted mb-0">Analizza la tua produttività e i tuoi progressi.</p>
            </div>

            {/* Card panoramica */}
            <div className="row g-3 mb-4">
                <div className="col-3">
                    <div className="stat-card">
                        <div className="stat-icon totale mb-2"><i className="bi bi-list-task" /></div>
                        <h3 className="fw-bold mb-0">{stats.total}</h3>
                        <p className="text-muted small mb-0">Attività totali</p>
                    </div>
                </div>
                <div className="col-3">
                    <div className="stat-card">
                        <div className="stat-icon completate mb-2"><i className="bi bi-check-circle" /></div>
                        <h3 className="fw-bold mb-0">{stats.completed}</h3>
                        <p className="text-muted small mb-0">Completate</p>
                    </div>
                </div>
                <div className="col-3">
                    <div className="stat-card">
                        <div className="stat-icon incorso mb-2"><i className="bi bi-clock" /></div>
                        <h3 className="fw-bold mb-0">{stats.inProgress}</h3>
                        <p className="text-muted small mb-0">In corso</p>
                    </div>
                </div>
                <div className="col-3">
                    <div className="stat-card">
                        <div className="stat-icon rimandati mb-2"><i className="bi bi-arrow-clockwise" /></div>
                        <h3 className="fw-bold mb-0">{stats.postponed}</h3>
                        <p className="text-muted small mb-0">Rimandati</p>
                    </div>
                </div>
            </div>

            {/* Grafici */}
            <div className="row g-4 mb-4">
                {/* Grafico a barre */}
                <div className="col-lg-4">
                    <div className="chart-card h-100">
                        <h6 className="fw-bold mb-4">Attività completate per giorno</h6>
                        <Bar data={dayData} options={chartOptions} />
                    </div>
                </div>

                {/* Grafico a torta priorità */}
                <div className="col-lg-4">
                    <div className="chart-card  h-100 d-flex flex-column">
                        <h6 className="fw-bold mb-4">Distribuzione per priorità</h6>
                        <div className="doughnut-container">
                            <Doughnut data={priorityData} options={doughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Andamento produttività */}
                <div className="col-lg-4">
                    <div className="chart-card h-100">
                        <h6 className="fw-bold mb-4">Andamento produttività</h6>
                        {stats.productivity.length === 0 ? (
                            <p className="text-muted text-center py-3">Completa alcune attività per vedere l'andamento!</p>
                        ) : (
                            <Line data={productivityData} options={lineOptions} />
                        )}
                    </div>
            </div>



            </div>

            {/* Categorie */}
            <div className="row g-4">
                <div className="col-12">
                    <div className="chart-card">
                        <h6 className="fw-bold mb-4">Attività per categoria</h6>
                        <div className="row">
                            {stats.byCategory.map(cat => (
                                <div key={cat._id} className="col-6 category-bar">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="fw-semibold small text-capitalize">{cat._id}</span>
                                        <span className="text-muted small">{cat.count} attività — {Math.round((cat.done / cat.count) * 100)}%</span>
                                    </div>
                                    <div className="category-progress">
                                        <div
                                            className={`category-progress-fill ${cat._id}`}
                                            style={{ width: `${Math.round((cat.done / cat.count) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;