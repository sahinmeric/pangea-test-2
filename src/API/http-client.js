import axios from "axios";
import { getAuthToken, removeAuthToken } from "./token-util";
import { ConfigValue } from "../Config";

// TODO: Due to windows timeout was set to 15000
const Axios = axios.create({
  baseURL: ConfigValue.PUBLIC_REST_API_ENDPOINT,
  timeout: 120000, //150000000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Change request data/error here
Axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    ``;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || (error.response.status === 422 && error.response.data?.error === 'Invalid token'))) {
      removeAuthToken();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export class HttpClient {
  static async get(url, params = null) {
    const response = await Axios.get(url, { params });
    return response.data;
  }

  static async post(url, data) {
    const response = await Axios.post(url, data);
    return response.data;
  }

  static async put(url, data) {
    const response = await Axios.put(url, data);
    return response.data;
  }

  static async delete(url) {
    const response = await Axios.delete(url);
    return response.data;
  }
}
