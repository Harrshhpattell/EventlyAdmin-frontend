/* eslint-disable */
import axios from 'axios';

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
