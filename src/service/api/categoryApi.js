import axiosClient from "../instance";

export const getAllCategories = async () => {
  const response = await axiosClient.get("/categories");
  return response;
};

export const createCategory = async (categoryData) => {
  const response = await axiosClient.post("/categories", categoryData);
  return response;
};

export const updateCategory = async (categoryId, categoryData) => {
  const response = await axiosClient.post(`/categories/${categoryId}`, categoryData);
  return response;
};

export const updateCategoryActiveStatus = async (categoryId) => {
  const response = await axiosClient.put(`/categories/${categoryId}/active-status`);
  return response;
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryActiveStatus,
};

