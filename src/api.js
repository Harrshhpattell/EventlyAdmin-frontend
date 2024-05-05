/* eslint-disable */
import axios from 'axios';
import Cookies from 'js-cookie'

// Set up Axios interceptors to include the token in the headers for every request
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authorizationAdmin');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const getAdmin = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/adminList')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const toggleAdminStatus = async (id) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/v1/adminList/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling admin status:', error);
    throw error;
  }
};

export const deleteAdmin = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/adminList/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/admin/allusers')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}
export const getallevents = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/adminEvent/allevents')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}
export const getallorders = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/adminOrders/allorders')
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export const getUsersCountByMonth = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const response = await axios.get(`http://localhost:8000/api/v1/admin/getUsersCountByMonth/${currentYear}`)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const getEventsCountByMonth = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const response = await axios.get(`http://localhost:8000/api/v1/adminEvent/getEventsCountByMonth/${currentYear}`)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}
export const getOrdersCountByMonth = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const response = await axios.get(`http://localhost:8000/api/v1/adminOrders/getOrdersCountByMonth/${currentYear}`)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}


export const deleteEventById = async (eventId) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/adminEvent/deleteEvent/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

export const signup = async (userData) => {
  const response = await axios.post(`http://localhost:8000/api/v1/signup`, userData, {
    withCredentials: true,
    // headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const loginApi = async (userData) => {
  const response = await axios.post(`http://localhost:8000/api/v1/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

// get category
export const categoryGetApi = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/category`);
    return response.data
  } catch (error) {
    console.error('Error fetching category:', error)
    throw error
  }
}

// add category
export const categoryPostApi = async (category) => {
  try {
    const response = await axios.post(`http://localhost:8000/api/v1/category`, category);
    return response.data
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

// delete category
export const categoryDeleteApi = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/category/${id}`);
    return response.data
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

// Update category
export const categoryUpdateApi = async (id, newData) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/v1/category/${id}`, newData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};