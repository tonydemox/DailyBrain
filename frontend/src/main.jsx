import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/frontend'
import { AuthProvider } from './context/AuthContext.jsx';
import { TaskProvider } from './context/TaskContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <SocketProvider>
                <TaskProvider>
                    <App />
                </TaskProvider>
            </SocketProvider>
        </AuthProvider>
    </StrictMode>,
)