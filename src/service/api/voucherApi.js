import axiosClient from '../instance';

const normalizeCampaignResponse = (response) => {
  if (!response) return { content: [], pagination: {} };

  const dataCandidate =
    response?.data?.data ||
    response?.data ||
    response;

  const content = Array.isArray(dataCandidate?.content)
    ? dataCandidate.content
    : Array.isArray(dataCandidate)
      ? dataCandidate
      : [];

  return {
    content,
    pagination: {
      totalElements: dataCandidate?.totalElements ?? content.length,
      pageNumber: dataCandidate?.pageable?.pageNumber ?? 0,
      pageSize: dataCandidate?.pageable?.pageSize ?? content.length,
    },
  };
};

export const getVoucherCampaigns = async (params = {}) => {
  const {
    name,
    from,
    to,
    page = 0,
    size = 10,
  } = params;

  const response = await axiosClient.get('/vouchers/campaigns/admin', {
    params: {
      name: name || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      size,
    },
  });

  return normalizeCampaignResponse(response);
};

export const createVoucherCampaign = async (data) => {
  if (!data) throw new Error('Request payload is required');
  
  const response = await axiosClient.post('/vouchers/campaigns', data);
  return response;
};

export const getVouchers = async (params = {}) => {
  const {
    campaignId,
    code,
    name,
    voucherType,
    status,
    minOrderValue,
    maxDiscount,
    active,
    page = 0,
    size = 10,
  } = params;

  const response = await axiosClient.get('/vouchers/admin', {
    params: {
      campaignId: campaignId || undefined,
      code: code || undefined,
      name: name || undefined,
      voucherType: voucherType || undefined,
      status: status || undefined,
      minOrderValue: minOrderValue || undefined,
      maxDiscount: maxDiscount || undefined,
      active: active !== undefined ? active : undefined,
      page,
      size,
    },
  });

  return normalizeCampaignResponse(response);
};

export const getMyVouchers = async () => {
  const response = await axiosClient.get('/vouchers/my-vouchers');
  return response;
};

export const getRedeemableCampaigns = async (params = {}) => {
  const {
    name,
    from,
    to,
    page = 0,
    size = 10,
  } = params;

  const response = await axiosClient.get('/vouchers/campaigns/customer', {
    params: {
      name: name || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      size,
    },
  });

  return normalizeCampaignResponse(response);
};

export const getCampaignVouchersPublic = async (campaignId) => {
  if (!campaignId) throw new Error('campaignId is required');

  const response = await axiosClient.get('/vouchers/customer', {
    params: {
      campaignId,
      page: 0,
      size: 100,
    },
  });

  return normalizeCampaignResponse(response);
};

export const redeemVoucher = async (voucherId) => {
  if (!voucherId) throw new Error('voucherId is required');
  const response = await axiosClient.post(`/vouchers/${voucherId}/redeem`);
  return response;
};

export const updateVoucherCampaign = async (campaignId, data) => {
  if (!campaignId) throw new Error('campaignId is required');
  if (!data) throw new Error('Request payload is required');
  
  const response = await axiosClient.put(`/vouchers/campaigns/${campaignId}`, data);
  return response;
};

export const changeVoucherStatus = async (voucherId, status) => {
  if (!voucherId) throw new Error('voucherId is required');
  if (!status) throw new Error('status is required');
  
  const response = await axiosClient.patch(`/vouchers/${voucherId}/change-status`, null, {
    params: { status },
  });
  return response;
};

export const toggleVoucherActiveStatus = async (voucherId) => {
  if (!voucherId) throw new Error('voucherId is required');
  
  const response = await axiosClient.patch(`/vouchers/${voucherId}/toggle-status`);
  return response;
};

export const createVoucher = async (data) => {
  if (!data) throw new Error('Request payload is required');
  
  const response = await axiosClient.post('/vouchers', data);
  return response;
};

export const updateVoucher = async (voucherId, data) => {
  if (!voucherId) throw new Error('voucherId is required');
  if (!data) throw new Error('Request payload is required');
  
  const response = await axiosClient.put(`/vouchers/${voucherId}`, data);
  return response;
};

export default {
  getVoucherCampaigns,
  createVoucherCampaign,
  getVouchers,
  getMyVouchers,
  getRedeemableCampaigns,
  getCampaignVouchersPublic,
  redeemVoucher,
  updateVoucherCampaign,
  changeVoucherStatus,
  toggleVoucherActiveStatus,
  createVoucher,
  updateVoucher,
};

