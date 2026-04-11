import api from './api';

export const getUserBookings = async () => {
  const response = await api.get('/bookings/');
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings/create/', bookingData);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.post(`/bookings/${id}/cancel/`);
  return response.data;
};