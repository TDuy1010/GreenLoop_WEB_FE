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

export default {
  getMyOrders,
  getMyOrderDetail,
  getAdminOrders,
  getAdminOrderDetail,
  getOrderHistory
}

