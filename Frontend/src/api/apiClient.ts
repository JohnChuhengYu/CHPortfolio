import axios from "axios";

// Creates an axios instance pointing to our local .NET 10 Backend
export const apiClient = axios.create({
    baseURL: "http://localhost:5298",
    headers: {
        "Content-Type": "application/json",
    },
});

// Example request interceptor (can be used for adding auth tokens later)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("ch_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
