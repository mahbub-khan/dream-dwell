import axios from "axios";
import { clearToken } from "./auth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_api_url,
  withCredentials: true,
});

//intercept response and check for unauthorized access
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Error tracked in the interceptor---->", error.message);

    //logout user if it is an unauthorized access
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      await clearToken();

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;
