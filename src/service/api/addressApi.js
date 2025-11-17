import axiosClient from '../instance';
import { getUserInfo } from './authApi';

const getUserId = () => {
  const info = getUserInfo();
  return info?.userId ? Number(info.userId) : null;
};

const withUserHeader = () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('Vui lòng đăng nhập để quản lý địa chỉ.');
  }
  return {
    headers: {
      'X-User-ID': userId,
    },
  };
};

export const getAddresses = async () => {
  const response = await axiosClient.get('/addresses', withUserHeader());
  return response;
};

export const createAddress = async (payload) => {
  if (!payload) throw new Error('Vui lòng nhập thông tin địa chỉ.');
  const response = await axiosClient.post('/addresses', payload, withUserHeader());
  return response;
};

export const updateAddress = async (addressId, payload) => {
  if (!addressId) throw new Error('Thiếu mã địa chỉ.');
  const response = await axiosClient.put(`/addresses/${addressId}`, payload, withUserHeader());
  return response;
};

export const deleteAddress = async (addressId) => {
  if (!addressId) throw new Error('Thiếu mã địa chỉ.');
  const response = await axiosClient.delete(`/addresses/${addressId}`, withUserHeader());
  return response;
};

export const setDefaultAddress = async (addressId) => {
  if (!addressId) throw new Error('Thiếu mã địa chỉ.');
  const response = await axiosClient.put(`/addresses/${addressId}/set-default`, null, withUserHeader());
  return response;
};

export const getAddressDetail = async (addressId) => {
  if (!addressId) throw new Error('Thiếu mã địa chỉ.');
  const response = await axiosClient.get(`/addresses/${addressId}`, withUserHeader());
  return response;
};

export const getCities = async () => {
  const response = await axiosClient.get('/goship/addresses/cities');
  return response;
};

export const getDistrictsByCity = async (cityId) => {
  if (!cityId) throw new Error('Thiếu mã tỉnh/thành phố.');
  const response = await axiosClient.get(`/goship/addresses/cities/${cityId}/districts`);
  return response;
};

export const getWardsByDistrict = async (districtId) => {
  if (!districtId) throw new Error('Thiếu mã quận/huyện.');
  const response = await axiosClient.get(`/goship/addresses/districts/${districtId}/wards`);
  return response;
};

export default {
  getAddresses,
  getAddressDetail,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getCities,
  getDistrictsByCity,
  getWardsByDistrict,
};

