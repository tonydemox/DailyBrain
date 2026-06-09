import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAllTasks, getTasks, getPostponed, getStatistics } from '../services/api';
import { useSocket } from './SocketContext.jsx';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [allTasks, setAllTasks] = useState([]);
    const [activeTasks, setActiveTasks] = useState([]);
    const [postponedTasks, setPostponedTasks] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const { socket } = useSocket();

    const refreshTasks = useCallback(async () => {
        setLoading(true);
        try {
            const [all, active, postponed, stats] = await Promise.all([
                getAllTasks(),
                getTasks(),
                getPostponed(),
                getStatistics()
            ]);
            setAllTasks(all);
            setActiveTasks(active);
            setPostponedTasks(postponed);
            setStatistics(stats);
        } catch (err) {
            console.error('Errore caricamento task:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // aggiorna automaticamente quando arrivano eventi Socket.IO
    useEffect(() => {
        if (!socket) return;

        socket.on('task:updated', () => refreshTasks());
        socket.on('task:deleted', () => refreshTasks());
        socket.on('tasks:new', () => refreshTasks());

        return () => {
            socket.off('task:updated');
            socket.off('task:deleted');
            socket.off('tasks:new');
        };
    }, [socket, refreshTasks]);

    return (
        <TaskContext.Provider value={{
            allTasks,
            activeTasks,
            postponedTasks,
            statistics,
            loading,
            refreshTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export const useTasks = () => useContext(TaskContext);