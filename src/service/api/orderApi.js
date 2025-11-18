import axiosClient from '../instance'

export const getMyOrders = async (params = {}) => {
  const query = new URLSearchParams({
    page: params.page ?? 0,
    size: params.size ?? 10,
    sortBy: params.sortBy ?? 'createdAt',
    sortDirection: params.sortDirection ?? 'DESC',
    status: params.status ?? '',
    paymentStatus: params.paymentStatus ?? '',
    searchKeyword: params.searchKeyword ?? '',
    fromDate: params.fromDate ?? '',
    toDate: params.toDate ?? ''
  })

  return axiosClient.get(`/orders/my-orders?${query.toString()}`)
}

export const getMyOrderDetail = async (orderId) => {
  if (!orderId) throw new Error('orderId is required')
  return axiosClient.get(`/orders/my-orders/${orderId}`)
}


