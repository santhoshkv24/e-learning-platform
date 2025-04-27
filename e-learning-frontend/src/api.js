import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (courseData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/courses/create`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeLecture = async (data, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/progress/complete-lecture`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createComment = async (commentData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/comments`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getAllComments = async (courseId) => {
  try {
    const response = await axios.get(`${BASE_URL}/comments?courseId=${courseId}`);
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const uploadFile = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};