import React from 'react'
import { motion } from 'framer-motion'
import { EnvironmentOutlined, UserOutlined, EditOutlined } from '@ant-design/icons'

const LoadingState = () => (
  <div className="border border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-4 bg-white">
    <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 mx-auto animate-spin" />
    <p className="text-slate-500">Đang tải địa chỉ...</p>
  </div>
)

const ErrorState = ({ onRetry, message }) => (
  <div className="border border-red-100 rounded-3xl p-10 text-center space-y-4 bg-red-50 text-red-600">
    {message}
    <button
      onClick={onRetry}
      className="px-4 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-100"
    >
      Thử lại
    </button>
  </div>
)

const EmptyState = ({ onAddNew }) => (
  <div className="border border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-4 bg-white">
    <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl">
      🏠
    </div>
    <h3 className="text-lg font-semibold text-slate-900">Bạn chưa có địa chỉ nào</h3>
    <p className="text-slate-500">Hãy thêm địa chỉ đầu tiên để việc giao nhận được thuận tiện hơn.</p>
    <button
      onClick={onAddNew}
      className="px-5 py-2 rounded-full border border-emerald-200 text-emerald-600 font-semibold hover:bg-emerald-50"
    >
      + Thêm địa chỉ
    </button>
  </div>
)

const AddressCard = ({ address, index, onViewDetail, onEdit, onDelete, onSetDefault }) => (
  <motion.div
    key={address.id}
    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition relative"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
  >
    {address.isDefault && (
      <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold">
        Mặc định
      </span>
    )}

    <h3 className="text-lg font-bold text-gray-900 mb-3">{address.recipientName || 'Chưa có tên người nhận'}</h3>

    <p className="text-gray-700 mb-2 flex items-start">
      <EnvironmentOutlined className="mr-2" />
      <span>{address.addressLine || 'Chưa có địa chỉ'}</span>
    </p>
    <p className="text-gray-700 mb-4 flex items-center">
      <UserOutlined className="mr-2" />
      <span>{address.recipientPhone || 'Chưa có SĐT'}</span>
    </p>

    <div className="flex gap-3 flex-wrap items-center">
      <motion.button
        className="text-slate-500 hover:text-slate-700 font-medium"
        whileHover={{ scale: 1.05 }}
        onClick={() => onViewDetail(address.id)}
      >
        Xem chi tiết
      </motion.button>
      <motion.button
        className="text-green-600 hover:text-green-700 font-medium"
        whileHover={{ scale: 1.05 }}
        onClick={() => onEdit(address)}
      >
        <EditOutlined /> Chỉnh sửa
      </motion.button>
      {!address.isDefault && (
        <>
          <span className="text-gray-300">|</span>
          <motion.button
            className="text-red-600 hover:text-red-700 font-medium"
            whileHover={{ scale: 1.05 }}
            onClick={() => onDelete(address.id)}
          >
            Xóa
          </motion.button>
          <span className="text-gray-300">|</span>
          <motion.button
            className="text-blue-600 hover:text-blue-700 font-medium"
            whileHover={{ scale: 1.05 }}
            onClick={() => onSetDefault(address.id)}
          >
            Đặt làm mặc định
          </motion.button>
        </>
      )}
    </div>
  </motion.div>
)

const AddressList = ({
  addresses,
  loading,
  fetchError,
  onRetry,
  onAddNew,
  onViewDetail,
  onEdit = () => {},
  onDelete,
  onSetDefault,
}) => {
  if (loading) return <LoadingState />
  if (fetchError) return <ErrorState onRetry={onRetry} message={fetchError} />
  if (!addresses.length) return <EmptyState onAddNew={onAddNew} />

  return (
    <div className="space-y-4">
      {addresses.map((addr, index) => (
        <AddressCard
          key={addr.id}
          address={addr}
          index={index}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  )
}

export default AddressList

