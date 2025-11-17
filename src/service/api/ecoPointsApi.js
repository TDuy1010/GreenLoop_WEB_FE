import axiosClient from "../instance";

export const getEcoPointRules = async (params = {}) => {
  const { actionType, code, name, categoryId } = params;

  const response = await axiosClient.get("/eco-points", {
    params: {
      actionType: actionType || undefined,
      code: code || undefined,
      name: name || undefined,
      categoryId: categoryId || undefined,
    },
  });

  return response;
};

export const createEcoPointRule = async (data) => {
  if (!data) throw new Error("Request payload is required");

  const response = await axiosClient.post("/eco-points", data);
  return response;
};

export const updateEcoPointRule = async (id, data) => {
  if (!id && id !== 0) throw new Error("Eco point rule id is required");
  if (!data) throw new Error("Request payload is required");

  const response = await axiosClient.put(`/eco-points/${id}`, data);
  return response;
};

export const changeEcoPointRuleStatus = async (id, isActive) => {
  if (!id && id !== 0) throw new Error("Eco point rule id is required");
  if (typeof isActive !== "boolean") throw new Error("isActive must be boolean");

  const response = await axiosClient.put(`/eco-points/${id}/status`, null, {
    params: {
      isActive,
    },
  });

  return response;
};

export default {
  getEcoPointRules,
  createEcoPointRule,
  updateEcoPointRule,
  changeEcoPointRuleStatus,
};

