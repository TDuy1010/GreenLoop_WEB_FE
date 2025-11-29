import React, { useState } from 'react'
import { Modal } from 'antd'
import { TagOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons'

const VoucherSelector = ({ onSelectVoucher, selectedVoucher }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data cho UI - chỉ để hiển thị
  const availableVouchers = [
    {
      id: 1,
      code: 'FREESHIP50',
      name: 'Miễn phí vận chuyển 50.000đ',
      discount: 50000,
      type: 'AMOUNT',
      description: 'Áp dụng cho đơn hàng từ 200.000đ',
      minOrder: 200000,
      validUntil: '31/12/2025'
    },
    {
      id: 2,
      code: 'SAVE10',
      name: 'Giảm 10%',
      discount: 10,
      type: 'PERCENT',
      description: 'Áp dụng cho đơn hàng từ 500.000đ',
      minOrder: 500000,
      validUntil: '30/11/2025'
    },
    {
      id: 3,
      code: 'NEWUSER',
      name: 'Giảm 30.000đ cho khách hàng mới',
      discount: 30000,
      type: 'AMOUNT',
      description: 'Áp dụng cho đơn hàng đầu tiên',
      minOrder: 0,
      validUntil: '31/12/2025'
    },
    {
      id: 4,
      code: 'SUMMER2025',
      name: 'Giảm 15% mùa hè',
      discount: 15,
      type: 'PERCENT',
      description: 'Áp dụng cho đơn hàng từ 300.000đ',
      minOrder: 300000,
      validUntil: '31/08/2025'
    },
    {
      id: 5,
      code: 'FREESHIP',
      name: 'Miễn phí vận chuyển',
      discount: 0,
      type: 'FREESHIP',
      description: 'Miễn phí vận chuyển cho mọi đơn hàng',
      minOrder: 0,
      validUntil: '31/12/2025'
    }
  ]

  const handleSelectVoucher = (voucher) => {
    if (selectedVoucher?.id === voucher.id) {
      onSelectVoucher(null)
    } else {
      onSelectVoucher(voucher)
    }
    setIsModalOpen(false)
  }

  const handleRemoveVoucher = (e) => {
    e.stopPropagation()
    onSelectVoucher(null)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TagOutlined className="text-emerald-600 text-lg" />
          <h3 className="text-lg font-semibold text-slate-900">Mã giảm giá / Voucher</h3>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium transition-colors"
        >
          {selectedVoucher ? 'Đổi voucher' : 'Chọn voucher'}
        </button>
      </div>

      {selectedVoucher && (
        <div className="mb-4 p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircleOutlined className="text-emerald-600" />
                <span className="font-semibold text-emerald-900">{selectedVoucher.name}</span>
              </div>
              <p className="text-sm text-emerald-700">{selectedVoucher.code}</p>
              {selectedVoucher.type === 'AMOUNT' ? (
                <p className="text-sm font-semibold text-emerald-800 mt-1">
                  Giảm {selectedVoucher.discount.toLocaleString('vi-VN')}đ
                </p>
              ) : selectedVoucher.type === 'PERCENT' ? (
                <p className="text-sm font-semibold text-emerald-800 mt-1">
                  Giảm {selectedVoucher.discount}%
                </p>
              ) : (
                <p className="text-sm font-semibold text-emerald-800 mt-1">
                  Miễn phí vận chuyển
                </p>
              )}
            </div>
            <button
              onClick={handleRemoveVoucher}
              className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
            >
              <CloseOutlined className="text-emerald-600" />
            </button>
          </div>
        </div>
      )}

      <Modal
        title={
          <div className="flex items-center gap-2">
            <TagOutlined className="text-emerald-600 text-xl" />
            <span className="text-xl font-semibold">Chọn voucher của bạn</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        className="voucher-modal"
      >
        <div className="max-h-[500px] overflow-y-auto space-y-3 mt-4">
          {availableVouchers.length > 0 ? (
            availableVouchers.map((voucher) => {
              const isSelected = selectedVoucher?.id === voucher.id
              return (
                <div
                  key={voucher.id}
                  onClick={() => handleSelectVoucher(voucher)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900">{voucher.name}</span>
                        {isSelected && <CheckCircleOutlined className="text-emerald-600" />}
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{voucher.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Mã: <strong>{voucher.code}</strong></span>
                        <span>HSD: {voucher.validUntil}</span>
                        {voucher.minOrder > 0 && (
                          <span>Đơn tối thiểu: {voucher.minOrder.toLocaleString('vi-VN')}đ</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      {voucher.type === 'AMOUNT' ? (
                        <span className="text-lg font-bold text-emerald-600">
                          -{voucher.discount.toLocaleString('vi-VN')}đ
                        </span>
                      ) : voucher.type === 'PERCENT' ? (
                        <span className="text-lg font-bold text-emerald-600">-{voucher.discount}%</span>
                      ) : (
                        <span className="text-lg font-bold text-emerald-600">Miễn phí ship</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-slate-500">
              <TagOutlined className="text-4xl text-slate-300 mb-2" />
              <p>Bạn chưa có voucher nào</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default VoucherSelector

