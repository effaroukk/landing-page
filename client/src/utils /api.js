import axios from 'axios';
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token); // Store token for later use
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
