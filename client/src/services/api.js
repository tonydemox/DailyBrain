import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// manda l'access token in ogni richiesta
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// se riceve 401 prova a fare il refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:3000/api/auth/refresh', { refreshToken });

                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                original.headers.Authorization = `Bearer ${accessToken}`;
                return api(original);
            } catch (err) {
                // refresh token scaduto → logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const createSession = async (text) => {
    const response = await api.post('/sessions', { text });
    return response.data;
};

export const getTasks = async () => {
    const response = await api.get('/tasks');
    return response.data;
};

export const getAllTasks = async () => {
    const response = await api.get('/tasks/all');
    return response.data;
};

export const getPostponed = async () => {
    const response = await api.get('/tasks/postponed');
    return response.data;
};

export const getStatistics = async () => {
    const response = await api.get('/tasks/statistics');
    return response.data;
};

export const getDailyPlan = async () => {
    const response = await api.get('/plan');
    return response.data;
};

export const updateTask = async (id, update) => {
    const response = await api.put(`/tasks/${id}`, update);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

export default api;