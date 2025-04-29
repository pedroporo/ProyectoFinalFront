import axios from "axios";

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const apiClient = axios.create({
  baseURL: "http://localhost:8765",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    
  },
});


apiClient.interceptors.request.use(
  (config) => {
    if (config.url.includes('/login')) {
      return config;
    }
    const token = getCookie('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const books = {
  getAll: () => apiClient.get(`/books`),
  getOne: (id) => apiClient.get(`/books/${id}`),
  create: (book) => apiClient.post(`/books`, book),
  modify: (book) => apiClient.put(`/books/${book.id}`, book),
  delete: (id) => apiClient.delete(`/books/${id}`),
  bookExist: (book) => apiClient.get(`/books/?moduleCode=${book.moduleCode}&userId=${book.userId}`),
};
export const modules = {
  getAll: () => apiClient.get(`/modules`),
  getOne: (id) => apiClient.get(`/modules/${id}`),
  create: (book) => apiClient.post(`/modules`, book),
  modify: (book) => apiClient.put(`/modules/${book.id}`, book),
  delete: (id) => apiClient.delete(`/modules/${id}`),
};
export const users = {
  getAll: () => apiClient.get(`/api/users/me`),
  getOne: (id) => apiClient.get(`/modules/${id}`),
  create: (book) => apiClient.post(`/modules`, book),
  modify: (book) => apiClient.put(`/modules/${book.id}`, book),
  delete: (id) => apiClient.delete(`/modules/${id}`),
  login: (user) =>
    apiClient.post(`/api/users/login`,user),
  logout: () =>
    apiClient.get(`/api/users/logout`),
};
export default {
  books,
  modules,
  users
}