import axios from "axios";

const axiosPublicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPublicClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  }
);

export default axiosPublicClient;


