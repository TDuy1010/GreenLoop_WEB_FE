import axiosClient from '../instance'

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })
  return query.toString()
}

export const getMyOrders = async (params = {}) => {
  const query = buildQueryString({
    page: params.page ?? 0,
    size: params.size ?? 10,
    sortBy: params.sortBy ?? 'createdAt',
    sortDirection: params.sortDirection ?? 'DESC',
    status: params.status,
    paymentStatus: params.paymentStatus,
    searchKeyword: params.searchKeyword,
    fromDate: params.fromDate,
    toDate: params.toDate
  })

  return axiosClient.get(`/orders/my-orders?${query}`)
}

export const getMyOrderDetail = async (orderId) => {
  if (!orderId) throw new Error('orderId is required')
  return axiosClient.get(`/orders/my-orders/${orderId}`)
}

export const getAdminOrders = async (params = {}) => {
  const query = buildQueryString({
    page: params.page ?? 0,
    size: params.size ?? 10,
    sortBy: params.sortBy ?? 'createdAt',
    sortDirection: params.sortDirection ?? 'DESC',
    status: params.status,
    paymentStatus: params.paymentStatus,
    paymentMethod: params.paymentMethod,
    searchKeyword: params.searchKeyword,
    customerId: params.customerId,
    fromDate: params.fromDate,
    toDate: params.toDate
  })

  return axiosClient.get(`/orders?${query}`)
}

export const getAdminOrderDetail = async (orderId) => {
  if (!orderId) throw new Error('orderId is required')
  return axiosClient.get(`/orders/${orderId}`)
}

export const getOrderHistory = async (orderId) => {
  if (!orderId) throw new Error('orderId is required')
  return axiosClient.get(`/orders/${orderId}/history`)
}

export const cancelMyOrder = async (orderId, reason) => {
  if (!orderId) throw new Error('orderId is required')
  const query = buildQueryString({ reason })
  const querySuffix = query ? `?${query}` : ''
  return axiosClient.post(`/orders/${orderId}/cancel${querySuffix}`)
}

export const confirmOrderByStaff = async (orderId, reason) => {
  if (!orderId) throw new Error('orderId is required')
  const query = buildQueryString({ reason })
  const querySuffix = query ? `?${query}` : ''
  return axiosClient.post(`/orders/${orderId}/confirm${querySuffix}`)
}

export const processOrderByStaff = async (orderId, reason) => {
  if (!orderId) throw new Error('orderId is required')
  const query = buildQueryString({ reason })
  const querySuffix = query ? `?${query}` : ''
  return axiosClient.post(`/orders/${orderId}/process${querySuffix}`)
}

export const createShipmentForOrder = async (orderId, payload) => {
  if (!orderId) throw new Error('orderId is required')
  return axiosClient.post(`/orders/${orderId}/ship`, payload)
}

export const cancelOrderByStaff = async (orderId, reason) => {
  if (!orderId) throw new Error('orderId is required')
  const query = buildQueryString({ reason })
  const querySuffix = query ? `?${query}` : ''
  return axiosClient.post(`/orders/${orderId}/cancel${querySuffix}`)
}

export default {
  getMyOrders,
  getMyOrderDetail,
  getAdminOrders,
  getAdminOrderDetail,
  getOrderHistory,
  cancelMyOrder,
  confirmOrderByStaff,
  processOrderByStaff,
  createShipmentForOrder,
  cancelOrderByStaff
}

