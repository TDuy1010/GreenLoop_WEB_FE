import axiosClient from '../instance';

/**
 * Lấy danh sách blog với filter/search/pagination cho Admin/Manager/Staff
 * Backend trả về schema:
 * {
 *   success,
 *   data: {
 *     content: [],
 *     pageNumber,
 *     pageSize,
 *     totalElements,
 *     totalPages,
 *     ...
 *   }
 * }
 */
export const getBlogs = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    search,
    status,
    sortBy = 'createdAt',
    sortDir = 'DESC'
  } = params;

  const response = await axiosClient.get('/blogs', {
    params: {
      page,
      size,
      search,
      status,
      sortBy,
      sortDir
    }
  });

  return response;
};

export const createBlog = async ({ blog, thumbnail }) => {
  const formData = new FormData();
  formData.append('blog', JSON.stringify(blog));
  if (thumbnail) {
    formData.append('thumbnail', thumbnail, thumbnail.name);
  }

  const response = await axiosClient.post('/blogs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    }
  });

  return response;
};

export const getBlogDetail = async (id) => {
  const response = await axiosClient.get(`/blogs/${id}`);
  return response;
};

export const updateBlog = async (id, { blog, thumbnail }) => {
  const formData = new FormData();
  formData.append('blog', JSON.stringify(blog));
  if (thumbnail) {
    formData.append('thumbnail', thumbnail, thumbnail.name);
  }

  const response = await axiosClient.put(`/blogs/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    }
  });

  return response;
};

export const publishBlog = async (id) => {
  const response = await axiosClient.patch(`/blogs/${id}/publish`);
  return response;
};

export const hideBlog = async (id) => {
  const response = await axiosClient.patch(`/blogs/${id}/hide`);
  return response;
};

export const deleteBlog = async (id) => {
  const response = await axiosClient.delete(`/blogs/${id}`);
  return response;
};

export const getPublishedBlogs = async (params = {}) => {
  const {
    page = 0,
    size = 9,
    search,
    sortBy = 'publishedAt',
    sortDir = 'DESC'
  } = params;

  const response = await axiosClient.get('/blogs/published', {
    params: {
      page,
      size,
      search,
      sortBy,
      sortDir
    }
  });

  return response;
};

export default {
  getBlogs,
  createBlog,
  getBlogDetail,
  updateBlog,
  publishBlog,
  hideBlog,
  deleteBlog,
  getPublishedBlogs
};

