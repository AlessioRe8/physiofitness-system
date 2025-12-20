import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const tokenString = localStorage.getItem('access_token');
    if (tokenString) {
        const token = JSON.parse(tokenString);

        if (token.access) {
            config.headers.Authorization = `Bearer ${token.access}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;