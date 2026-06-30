import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setError('Compila tutti i campi');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await register(name, email, password);
            authLogin(data.user, data.accessToken, data.refreshToken);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Errore durante la registrazione');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-logo mb-4">DailyBrain</h2>
                <h3 className="auth-title">Crea account</h3>
                <p className="text-muted mb-4">Inizia ad organizzare la tua giornata</p>

                {error && <div className="auth-error mb-3">{error}</div>}

                <div className="mb-3">
                    <label className="form-label small fw-semibold">Nome</label>
                    <input
                        type="text"
                        className="form-control auth-input"
                        placeholder="Il tuo nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-semibold">Email</label>
                    <input
                        type="email"
                        className="form-control auth-input"
                        placeholder="tu@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label small fw-semibold">Password</label>
                    <input
                        type="password"
                        className="form-control auth-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="btn btn-auth mb-3" onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Registrati
                </button>

                <p className="text-center text-muted small mb-0">
                    Hai già un account?{' '}
                    <span className="auth-link" onClick={() => navigate('/login')}>Accedi</span>
                </p>
            </div>
        </div>
    );
}

export default Register;