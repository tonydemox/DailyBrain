import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const links = [
        { path: '/', label: 'Home', icon: 'bi-house' },
        { path: '/dashboard', label: 'Le mie attività', icon: 'bi-list-task' },
        { path: '/postponed', label: 'Rimandati', icon: 'bi-arrow-clockwise' },
        { path: '/statistics', label: 'Statistiche', icon: 'bi-bar-chart' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar d-flex flex-column p-3">
            <div className="mb-4 px-2">
                <h2 className="sidebar-logo mb-0">DailyBrain</h2>
            </div>

            <nav className="flex-grow-1">
                {links.map(link => (
                    <div
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={`sidebar-link d-flex align-items-center gap-3 px-3 py-2 mb-1 ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        <i className={`bi ${link.icon} fs-5`} />
                        <span>{link.label}</span>
                    </div>
                ))}
            </nav>

            {/* Footer con utente e logout */}
            <div className="sidebar-footer p-3 rounded">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="sidebar-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="mb-0 fw-semibold small">{user?.name}</p>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</p>
                    </div>
                </div>
                <button className="btn btn-sm w-100 btn-outline-secondary" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2" />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;