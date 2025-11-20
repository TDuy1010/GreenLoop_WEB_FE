import React from 'react';
import { motion } from 'framer-motion';
import { formatDateVN } from '../../../../utils/dateUtils';

const statusColorMap = {
  ACTIVE: 'bg-green-50 text-green-700 border border-green-200',
  UPCOMING: 'bg-blue-50 text-blue-700 border border-blue-200',
  USED: 'bg-gray-50 text-gray-500 border border-gray-200',
  EXPIRED: 'bg-red-50 text-red-600 border border-red-200',
  REDEEMED: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
};

const voucherTypeLabel = {
  PERCENT: 'Giảm phần trăm',
  AMOUNT: 'Giảm theo số tiền',
  FREESHIP: 'Miễn phí vận chuyển',
  FREE_ITEM: 'Quà tặng kèm',
};

const formatVoucherValue = (voucher) => {
  const value = voucher?.value ?? 0;
  switch (voucher?.voucherType) {
    case 'PERCENT':
      return `${value}%`;
    case 'AMOUNT':
      return `${value.toLocaleString('vi-VN')}đ`;
    case 'FREESHIP':
      return 'Miễn phí vận chuyển';
    case 'FREE_ITEM':
      return 'Quà tặng kèm';
    default:
      return value;
  }
};

const EmptyState = ({ onReload }) => (
  <div className="text-center py-12 space-y-4">
    <div className="w-20 h-20 mx-auto rounded-full bg-green-50 text-green-500 flex items-center justify-center text-3xl">
      🎁
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-700 mb-1">Chưa có voucher nào</p>
      <p className="text-gray-500">Hãy tham gia sự kiện hoặc chiến dịch để nhận voucher ưu đãi.</p>
    </div>
    {onReload && (
      <button
        onClick={onReload}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Tải lại
      </button>
    )}
  </div>
);

const MyVouchersTab = ({ vouchers = [], loading, error, onReload }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4">
        <div className="text-3xl">⚠️</div>
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={onReload}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!vouchers || vouchers.length === 0) {
    return <EmptyState onReload={onReload} />;
  }

  return (
    <div className="space-y-4">
      {vouchers.map((voucher, index) => {
        const status = (voucher.voucherStatus || voucher.status || '').toUpperCase();
        const statusClass = statusColorMap[status] || 'bg-gray-50 text-gray-600 border border-gray-200';
        const code = voucher.code || voucher.voucherCode || `VOUCHER-${index + 1}`;
        const displayName = voucher.name || voucher.voucherName || code;

        return (
          <motion.div
            key={voucher.id || voucher.voucherId || code}
            className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tên voucher</p>
                <p className="text-2xl font-bold tracking-wide text-gray-900">{displayName}</p>
                {code && displayName !== code && (
                  <p className="text-xs text-gray-400 mt-0.5">Mã: {code}</p>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusClass}`}>
                  {status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Đang cập nhật'}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {voucherTypeLabel[voucher.voucherType] || 'Voucher'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p className="text-gray-500 mb-1">Giá trị</p>
                <p className="font-semibold text-gray-900">{formatVoucherValue(voucher)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Đơn tối thiểu</p>
                <p className="font-semibold text-gray-900">
                  {voucher.minOrderValue ? `${voucher.minOrderValue.toLocaleString('vi-VN')}đ` : 'Không yêu cầu'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Hạn sử dụng</p>
                <p className="font-semibold text-gray-900">
                  {voucher.expiryDate ? formatDateVN(voucher.expiryDate) : 'Không xác định'}
                </p>
              </div>
            </div>

            {voucher.description && (
              <p className="mt-4 text-gray-600">{voucher.description}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {voucher.pointToRedeem !== undefined && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                  {voucher.pointToRedeem} điểm Eco
                </span>
              )}
              {voucher.remainingQuantity !== undefined && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Còn lại: {voucher.remainingQuantity}/{voucher.quantity || '—'}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MyVouchersTab;

