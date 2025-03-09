import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const API_URL =
  process.env.API_URL || 'https://rca-sda-attendance-mis.onrender.com';
// "http://localhost:3500"
const commonHeaders = {
  'Content-Type': 'application/json',
};

// Create an Axios instance for unauthorized requests
const unauthorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: commonHeaders,
  withCredentials: true,
});

// Create an Axios instance for authorized requests
const authorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: commonHeaders,
  withCredentials: true,
});

// Function to check if the access token is expired or about to expire
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const bufferTime = 60000; // 1 minute buffer time
    return expirationTime - currentTime < bufferTime; // Token is expired or about to expire
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume token is invalid if decoding fails
  }
};

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await unauthorizedAxiosInstance.get('/auth/refresh', {
      withCredentials: true,
    });
    if (response.status === 200 && response.data.accessToken) {
      cookies.set('accessToken', response.data.accessToken, { path: '/' });
      return response.data.accessToken;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Handle token refresh failure (e.g., redirect to login)
    cookies.remove('accessToken', { path: '/' });
    cookies.remove('refreshToken', { path: '/' });
    window.location.href = '/'; // Redirect to login page
  }
  return null;
};

// Add a request interceptor to attach the access token to authorized requests
authorizedAxiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = cookies.get('accessToken');
    if (token) {
      // Check if the token is expired or about to expire
      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          config.headers = config.headers || {}; // Ensure headers exist
          config.headers['Authorization'] = `Bearer ${newToken}`;
        } else {
          throw new Error('Unable to refresh access token');
        }
      } else {
        config.headers = config.headers || {}; // Ensure headers exist
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle token expiration errors
authorizedAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {}; // Ensure headers exist
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return authorizedAxiosInstance(originalRequest); // Retry the request with the new token
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Handle token refresh failure (e.g., redirect to login)
        cookies.remove('accessToken', { path: '/' });
        cookies.remove('refreshToken', { path: '/' });
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  },
);

// Export the Axios instances
export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;
