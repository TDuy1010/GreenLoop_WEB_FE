import axiosClient from "../instance";
import { getUserInfo } from "./authApi";

const getUserId = () => {
  const userInfo = getUserInfo();
  const userId = userInfo?.userId;
  return userId ? Number(userId) : null;
};

export const addToCart = async (productId) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
  }

  const response = await axiosClient.post(
    "/carts/items",
    {
      productId,
      quantity: 1,
    },
    {
      headers: {
        "X-User-ID": userId,
      },
    },
  );

  return response;
};

export const getCart = async () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Vui lòng đăng nhập để xem giỏ hàng");
  }

  const response = await axiosClient.get("/carts", {
    headers: {
      "X-User-ID": userId,
    },
  });

  return response;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Vui lòng đăng nhập để cập nhật giỏ hàng");
  }

  const response = await axiosClient.put(
    `/carts/items/${cartItemId}`,
    {
      quantity,
    },
    {
      headers: {
        "X-User-ID": userId,
      },
    },
  );

  return response;
};

export const removeCartItem = async (cartItemId) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng");
  }

  const response = await axiosClient.delete(`/carts/items/${cartItemId}`, {
    headers: {
      "X-User-ID": userId,
    },
  });

  return response;
};

export const clearCart = async () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Vui lòng đăng nhập để xóa giỏ hàng");
  }

  const response = await axiosClient.delete("/carts", {
    headers: {
      "X-User-ID": userId,
    },
  });

  return response;
};

export default {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

