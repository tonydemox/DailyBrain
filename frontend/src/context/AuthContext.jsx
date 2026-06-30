import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);

    const login = (userData, accessTokenData, refreshTokenData) => {
        setUser(userData);
        setAccessToken(accessTokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessTokenData);
        localStorage.setItem('refreshToken', refreshTokenData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Errore logout:', err);
        } finally {
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
