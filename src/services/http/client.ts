import axios, { type AxiosInstance } from 'axios'

const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  throw new Error(
    'VITE_API_URL is not set. Copy .env.example to .env and point it at the API Gateway.',
  )
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
