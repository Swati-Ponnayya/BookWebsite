import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Load from .env

export const signup = async (userData) => {
  return axios.post(`${BASE_URL}/api/v1/auth/signup`, userData);
};

export const login = async (userData) => {
  return axios.post(`${BASE_URL}/api/v1/auth/login`, userData);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No data found! Please log in.");

  return axios.get(`${BASE_URL}/api/v1/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,  // 🔥 Ensure JWT is sent
    },
  });
};

export const updateUserProfile = async (user) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${BASE_URL}/api/v1/users/update-profile`,
    user,
    {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
);
};

export const updateUserRole = async (newRole) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${BASE_URL}/api/v1/users/update-role`,
    { role: newRole },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


export const getUserList = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No data found! Please log in.");

  return axios.get(`${BASE_URL}/api/v1/users/list-user`, {
    headers: {
      Authorization: `Bearer ${token}`,  // 🔥 Ensure JWT is sent
    },
  });
};


export const getSalesData = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No data found! Please log in.");

  return axios.get(`${BASE_URL}/api/v1/orders/sales-stats`, {
    headers: {
      Authorization: `Bearer ${token}`,  // 🔥 Ensure JWT is sent
    },
  });
};



export const getTopsellingBook= async () => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No data found! Please log in.");

  return axios.get(`${BASE_URL}/api/v1/orders/top-selling-books`, {
    headers: {
      Authorization: `Bearer ${token}`,  // 🔥 Ensure JWT is sent
    },
  });
};