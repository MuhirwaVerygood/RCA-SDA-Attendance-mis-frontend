import axios, { AxiosInstance } from "axios";
import { Cookies } from 'react-cookie';
const cookies = new Cookies();
const API_URL = process.env.API_URL || "http://localhost:3500";
const commonHeaders = {
    'Content-Type': 'application/json',
};
const unauthorizedAxiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: commonHeaders,
    withCredentials: true,
});
const authorizedAxiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: commonHeaders,
    withCredentials: true,
});
authorizedAxiosInstance.interceptors.request.use(
    async (config) => {
        const token = await cookies.get('accessToken');
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
authorizedAxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        
        

        if (error.response.data.statusCode === 401 && error.response.data.message === "Unauthorized") {
            try {
                const response = await generateAccessToken();
                console.log("Reached here");
                if (response?.status == 200) {
                    error.config.headers.authorization = `Bearer ${response.data.accessToken}`
                    return authorizedAPI.request(error.config);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export const generateAccessToken = async () => {
    try {
        const response = await unauthorizedAPI.get(`/auth/refresh`, {
            withCredentials: true,
        });
        return response
    } catch (error: any) {
        console.log(error);
        
    }
};
export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;