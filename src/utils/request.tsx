import env from "../config"
import axios, { AxiosError } from "axios"

// Create an axios instance
const instance = axios.create({
  timeout: 10000,
  timeoutErrorMessage: "Request Timeout",
  withCredentials: true,
})

console.log("env", env)

// Request interceptors
instance.interceptors.request.use(
  (config) => {
    // 設定 API baseURL
    config.baseURL = env.mock ? env.mockAPI : env.baseAPI
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptors
instance.interceptors.response.use(
  (response) => {
    console.log("===response data===", response)
    return response.data
  },
  (error) => {
    console.log("===error===", error.response)
    return Promise.reject(error)
  }
)

// Export the axios instance
export default {
  get<T>(url: string, params?: object): Promise<T> {
    return instance.get(url, { params })
  },
  post<T>(url: string, data?: object): Promise<T> {
    return instance.post(url, data)
  },
}
