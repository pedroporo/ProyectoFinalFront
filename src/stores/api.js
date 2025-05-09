import axios from "axios";
const baseURL = "http://localhost:8765";
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.url.includes("/login")) {
      return config;
    }
    const token = getCookie("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
      window.location.pathname !== "/login"
    ) {
      console.log("Interceptor");
      
      window.location.href = "/login";
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
  bookExist: (book) =>
    apiClient.get(
      `/books/?moduleCode=${book.moduleCode}&userId=${book.userId}`
    ),
};
export const modules = {
  getAll: () => apiClient.get(`/modules`),
  getOne: (id) => apiClient.get(`/modules/${id}`),
  create: (book) => apiClient.post(`/modules`, book),
  modify: (book) => apiClient.put(`/modules/${book.id}`, book),
  delete: (id) => apiClient.delete(`/modules/${id}`),
};
export const users = {
  name:"api/users",
  getAll: () => apiClient.get(`/${users.name}/me`),
  getOne: (id) => apiClient.get(`/modules/${id}`),
  create: (book) => apiClient.post(`/modules`, book),
  modify: (book) => apiClient.put(`/modules/${book.id}`, book),
  delete: (id) => apiClient.delete(`/modules/${id}`),
  loginGoogle: () => {
    window.location.href = baseURL + `/${users.name}/login/google`;
  },
  login: (user) => apiClient.post(`/${users.name}/login`, user),
  logout: () => apiClient.get(`/${users.name}/logout`),
};
export const agents = {
  name:"api/agents",
  getAll: () => apiClient.get(`/${agents.name}/`),
  getOne: (id) => apiClient.get(`/${agents.name}/${id}`),
  create: (agent) => apiClient.post(`/${agents.name}`, agent),
  modify: (agent) => apiClient.put(`/${agents.name}/${agent.id}`, agent),
  delete: (id) => apiClient.delete(`/${agents.name}/${id}`),
  make_calls: (id) => apiClient.get(`/${agents.name}/${id}`),
};
export const calls = {
  name:"api/calls",
  getAll: (agentId) => apiClient.get(`/${calls.name}/${agentId}`),
  getOne: (id) => apiClient.get(`/${calls.name}/${id}`),
  create: (call) => apiClient.post(`/${calls.name}`, call),
  modify: (call) => apiClient.put(`/${calls.name}/${call.id}`, call),
  delete: (id) => apiClient.delete(`/${calls.name}/${id}`),
  upload_csv: (csv,agentId) => apiClient.post(`/${calls.name}/${agentId}`, csv, {headers: {'Content-Type': 'multipart/form-data'}}),
};
export default {
  books,
  modules,
  users,
  agents,
  calls,
};
