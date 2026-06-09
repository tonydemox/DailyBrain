import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { user, accessToken } = useAuth();

    useEffect(() => {
        if (!user || !accessToken) return;

        const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000', {
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connesso');
            newSocket.emit('join', user.id);
        });

        newSocket.on('notification', (data) => {
            setNotifications(prev => [...prev, { id: Date.now(), message: data.message }]);
            // rimuovi notifica dopo 5 secondi
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== Date.now()));
            }, 5000);
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [user, accessToken]);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, removeNotification }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);