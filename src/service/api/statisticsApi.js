import axiosClient from '../instance'

// ===== EVENT STATISTICS =====
export const getEventStatistics = async () => {
  const response = await axiosClient.get('/events/dashboard/events')
  return response
}

export const getEventRegistrationStatistics = async () => {
  const response = await axiosClient.get('/events/dashboard/registrations')
  return response
}

export const getEventStaffStatistics = async () => {
  const response = await axiosClient.get('/events/dashboard/staff')
  return response
}

// ===== PRODUCT STATISTICS =====
export const getProductStatistics = async () => {
  const response = await axiosClient.get('/products/dashboard/products')
  return response
}

export const getCategoryStatistics = async () => {
  const response = await axiosClient.get('/products/dashboard/categories')
  return response
}

// ===== DONATION STATISTICS =====
export const getDonationStatistics = async () => {
  const response = await axiosClient.get('/products/dashboard/donations')
  return response
}

// ===== EVENT PRODUCT MAPPING STATISTICS =====
export const getEventProductMappingStatistics = async () => {
  const response = await axiosClient.get('/products/dashboard/event-mappings')
  return response
}

// ===== ECOPOINT STATISTICS =====
export const getEcoPointStatistics = async () => {
  const response = await axiosClient.get('/rewards/dashboard/eco-points')
  return response
}

// ===== VOUCHER STATISTICS =====
export const getVoucherStatistics = async () => {
  const response = await axiosClient.get('/rewards/dashboard/vouchers')
  return response
}

