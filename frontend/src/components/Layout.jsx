import Sidebar from './Sidebar';
import NotificationToast from './NotificationToast.jsx';
import '../styles/layout.css';

function Layout({ children }) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="layout-content">
                {children}
            </div>
            <NotificationToast />
        </div>
    );
}

export default Layout;