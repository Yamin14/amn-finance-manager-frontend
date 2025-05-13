import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000/',
});

// Add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Book APIs ----------
export const getBooks = async () => {
  const res = await API.get('/api/books');
  return res.data;
};

// ---------- Student APIs ----------
export const getStudents = async () => {
  const res = await API.get('/api/students');
  return res.data;
};

// ---------- Distribution APIs ----------
export const getDistributionsByBook = async (bookId: string) => {
  const res = await API.get(`/api/distributions`);
  // filter on client side since /distributions doesn't support query param
  return res.data.filter((d: any) => d.book._id === bookId);
};

export const addDistribution = async (data: {
  student: string;
  book: string;
  amountPaid: number;
}) => {
  const res = await API.post('/api/distributions', data);
  return res.data;
};
