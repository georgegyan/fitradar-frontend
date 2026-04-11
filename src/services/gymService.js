import api from './api';

export const getNearbyGyms = async (lat, lng, radiusKm = 5) => {
  const response = await api.get('/gyms/', { params: { lat, lng, radius_km: radiusKm } });
  return response.data;
};

export const getGymDetails = async (id) => {
  const response = await api.get(`/gyms/${id}/`);
  return response.data;
};

export const createGym = async (gymData) => {
  const response = await api.post('/gyms/create/', gymData);
  return response.data;
};

export const updateGym = async (id, gymData) => {
  const response = await api.put(`/gyms/${id}/update/`, gymData);
  return response.data;
};