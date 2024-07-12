// axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust this URL according to your backend API base URL
    timeout: 5000, // Adjust timeout if needed
});

export default axiosInstance;
