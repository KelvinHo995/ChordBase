import axios, { getAdapter } from 'axios';

// 1. Create the Axios Instance
// We don't export this directly to force the app to use the functions below
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Adjust port if needed    
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors (e.g., for attaching tokens)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const SongService = {
    getAll: async (params) => {
        const response = await apiClient.get('/songs', { params });
        return response.data;
    },

    getTrending: async () => {
        const response = await apiClient.get('/songs/popular');
        return response.data;
    },

    getById: async (songId, userId = null) => {
        const config = {
            params: {}
        };

        if (userId) 
            config.params.submittedBy = userId;

        const response = await apiClient.get(`/songs/${songId}`);
        return response.data;
    },

    create: async (songData) => {
        const response = await apiClient.post('/songs', songData);
        return response.data;
    },

    delete: async (songId, userId = null) => {
        const config = {
            params: {}
        };

        if (userId) 
            config.params.submittedBy = userId;

        const response = await apiClient.delete(`/songs/${songId}`, config);
        return response.data;
    }
}

export const UserService = {
    getAll: async () => {
        const response = await apiClient.get('/users');
        return response.data
    },

    getById: async (id) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    create: async (userData) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },

    updateStatus: async (id, userData) => {
        console.log("Updating user status:", userData);
        const response = await apiClient.put(`/users/${id}/status`, {status: userData.status});
        return response.data;
    },

    updateRole: async (id, userData) => {
        const response = await apiClient.put(`/users/${id}/role`, userData);
        return response.data;
    }
}

export const PlaylistService = {
    getAll: async () => {
        const response = await apiClient.get('/playlists');
        return response.data;
    },

    getById: async () => {
        const response = await apiClient.get(`/playlist/${id}`);
        return response.data;
    },

    create: async (playlistData) => {
        const response = await apiClient.post('/playlists', playlistData);
    }
}

export const AuthService = {
    loginUser: async (credentials) => {
        try {   
            const response = await apiClient.post('/auth/login', credentials);
            console.log('Logged in:', response);
            const token = response.data.token;
            localStorage.setItem('token', token);
            return response.data.user;
        } catch (error) {
            // console.log('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    registerUser: async (credentials) => {
        const response = await apiClient.post('/auth/register', credentials);
        const token = response.data.token;
        localStorage.setItem('token', token);
        return response.data.user;
    },

    requestPasswordReset: async (email) => {
        // Backend will look up user, generate token, and email it
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    confirmPasswordReset: async (token, newPassword) => {
        // You must send the TOKEN so the backend knows who this is for
        const response = await apiClient.post('/auth/reset-password', { 
            token, 
            newPassword 
        });
        return response.data;
    },

    loginWithGoogle: async (idToken) => {
        const response = await apiClient.post('/auth/google', { token: idToken });
        return response.data;
    }
}
