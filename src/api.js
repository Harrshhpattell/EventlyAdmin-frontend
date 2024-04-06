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
