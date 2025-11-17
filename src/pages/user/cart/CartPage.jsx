import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCart,
  removeCartItem,
  clearCart,
} from '../../../service/api/cartApi';
import { notifyCartUpdated } from '../../../utils/cartEvents';

const fallbackImage =
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=200&q=60';

const mapCartItem = (item) => {
  if (!item) return null;

  const product = item.product || {};

  return {
    ...item,
    quantity: item.quantity ?? 1,
    price: item.price ?? item.productPrice ?? 0,
    ecoPoints: item.ecoPoints ?? item.productEcoPoints ?? 0,
    product: {
      id: product.id ?? item.productId,
      name: product.name ?? item.productName ?? 'Sản phẩm không xác định',
      description:
        product.description ??
        item.productDescription ??
        item.description ??
        'Không có mô tả chi tiết.',
      thumbnailUrl: product.thumbnailUrl ?? item.productImage ?? null,
      imageUrl: product.imageUrl ?? null,
      imageUrls: product.imageUrls ?? item.productImages ?? [],
      categoryName: product.categoryName ?? item.productCategory ?? null,
      conditionGrade: product.conditionGrade ?? item.productCondition ?? null,
    },
  };
};

const normalizeCartItems = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data.map(mapCartItem).filter(Boolean);

  if (Array.isArray(data.items)) {
    return data.items.map(mapCartItem).filter(Boolean);
  }

  return [];
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCart();

      if (response?.success !== false) {
        const items = normalizeCartItems(response?.data ?? response);
        setCartItems(items);
        notifyCartUpdated(items.length);
      } else {
        showToast('error', response.message || 'Không thể tải giỏ hàng');
      }
    } catch (error) {
      showToast('error', error.message || 'Có lỗi xảy ra khi tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = (itemId) => {
    setConfirmModal({
      type: 'remove-item',
      targetId: itemId,
      title: 'Xóa sản phẩm?',
      message: 'Sản phẩm sẽ bị xóa khỏi giỏ hàng của bạn.',
      actionLabel: 'Xóa',
    });
  };

  const handleClearCart = () => {
    setConfirmModal({
      type: 'clear-cart',
      title: 'Xóa toàn bộ giỏ hàng?',
      message: 'Tất cả sản phẩm sẽ bị xóa và không thể khôi phục.',
      actionLabel: 'Xóa toàn bộ',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;

    try {
      if (confirmModal.type === 'remove-item') {
        setUpdatingItemId(confirmModal.targetId);
        await removeCartItem(confirmModal.targetId);
        showToast('success', 'Đã xóa sản phẩm khỏi giỏ hàng');
      }

      if (confirmModal.type === 'clear-cart') {
        setClearing(true);
        await clearCart();
        showToast('success', 'Đã xóa toàn bộ giỏ hàng');
      }

      fetchCart();
    } catch (error) {
      showToast('error', error.message || 'Không thể thực hiện thao tác');
    } finally {
      setUpdatingItemId(null);
      setClearing(false);
      setConfirmModal(null);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0,
    );
  }, [cartItems]);

  const totalEcoPoints = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.ecoPoints || 0) * (item.quantity || 1),
      0,
    );
  }, [cartItems]);

  const renderCartItem = (item) => {
    const product = item.product || {};
    const productImage =
      product.thumbnailUrl ||
      product.imageUrl ||
      (product.imageUrls && product.imageUrls[0]) ||
      fallbackImage;

    return (
      <div
        key={item.id}
        className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-[0_15px_45px_rgba(15,23,42,0.07)]"
      >
        <div className="flex gap-4 flex-1">
          <div className="relative">
            <img
              src={productImage}
              alt={product.name}
              className="w-24 h-24 rounded-xl object-cover border border-slate-100"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            {item.ecoPoints ? (
              <span className="absolute -bottom-2 left-2 px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-600">
                +{item.ecoPoints} EP
              </span>
            ) : null}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-lg text-slate-900">
                  {product.name || 'Sản phẩm không xác định'}
                </p>
                {product.code && (
                  <p className="text-xs text-slate-400 mt-1">#{product.code}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
              {product.description || 'Không có mô tả chi tiết.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                {product.categoryName || 'Sản phẩm tái chế'}
              </span>
              {product.conditionGrade && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  {product.conditionGrade}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-start md:items-end min-w-[180px]">
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Giá bán
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {(item.price || 0).toLocaleString('vi-VN')}đ
            </p>
          </div>
          <div className="flex justify-end w-full">
            <button
              className="mt-4 px-4 py-2 rounded-full  text-red-500 text-xs font-semibold hover: bg-slate-50 disabled:opacity-60"
              disabled={updatingItemId === item.id}
              onClick={() => handleRemoveItem(item.id)}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCartContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          <p>Đang tải giỏ hàng...</p>
        </div>
      );
    }

    if (!cartItems.length) {
      return (
        <div className="py-16 text-center text-slate-400 space-y-4">
          <div className="w-16 h-16 border border-dashed border-slate-300 rounded-full mx-auto flex items-center justify-center">
            <span className="text-2xl">🛒</span>
          </div>
          <p className="text-lg font-semibold text-slate-600">
            Giỏ hàng đang trống
          </p>
          <p className="text-sm text-slate-400">
            Hãy tiếp tục khám phá các sản phẩm yêu thích của bạn.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center px-5 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {cartItems.map(renderCartItem)}
        </div>
        <div className="flex flex-wrap gap-4 justify-between items-center mt-8">
          <button
            onClick={handleClearCart}
            disabled={clearing}
            className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-60"
          >
            Xóa toàn bộ
          </button>
          <button
            onClick={fetchCart}
            className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Làm mới
          </button>
        </div>
      </>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <p className="text-emerald-600 font-semibold uppercase text-sm tracking-[0.2em]">
          GreenLoop Cart
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
          Giỏ hàng của bạn
        </h1>
        <p className="text-slate-500 mt-3">
          Kiểm tra sản phẩm và hoàn tất đơn hàng để nhận thêm eco points.
        </p>
      </div>

      {toast && (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div>{renderCartContent()}</div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.07)] p-6 h-fit sticky top-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Tổng kết đơn hàng
          </h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Số lượng sản phẩm</span>
              <span className="font-semibold text-slate-900">
                {cartItems.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tổng eco points</span>
              <span className="font-semibold text-emerald-600">
                {totalEcoPoints}
              </span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between text-base">
              <span>Tạm tính</span>
              <span className="text-xl font-bold text-emerald-600">
                {subtotal.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
          <button
            className="mt-6 w-full py-3 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-50"
            disabled={!cartItems.length}
          >
            Tiến hành thanh toán
          </button>
          <a
            href="/shop"
            className="mt-3 block text-center text-sm text-slate-500 hover:text-emerald-600"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">
                {confirmModal.title}
              </h3>
              <p className="text-sm text-slate-500">{confirmModal.message}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600"
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;