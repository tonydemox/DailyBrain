import { useSocket } from '../context/SocketContext.jsx';
import '../styles/notification.css';

function NotificationToast() {
    const { notifications, removeNotification } = useSocket();

    if (notifications.length === 0) return null;

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <div key={notification.id} className="notification-toast d-flex align-items-center gap-3">
                    <span className="flex-grow-1">{notification.message}</span>
                    <button
                        className="btn-close-notification"
                        onClick={() => removeNotification(notification.id)}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

export default NotificationToast;