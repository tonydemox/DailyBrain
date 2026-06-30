import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Postponed from './pages/Postponed.jsx';
import Statistics from './pages/Statistics.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
    const { accessToken } = useAuth();
    return accessToken ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/postponed" element={<Postponed />} />
                                <Route path="/statistics" element={<Statistics />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;