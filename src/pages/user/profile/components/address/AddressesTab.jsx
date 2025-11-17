/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  getAddresses,
  getAddressDetail,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getCities,
  getDistrictsByCity,
  getWardsByDistrict
} from '../../../../../service/api/addressApi'
import AddressList from './AddressList'
import AddAddressModal from './AddAddressModal'
import AddressConfirmModal from './AddressConfirmModal'
import AddressDetailModal from './AddressDetailModal'

const initialForm = {
  recipientName: '',
  recipientPhone: '',
  addressLine: '',
  ward: '',
  wardCode: '',
  district: '',
  districtName: '',
  city: '',
  cityName: '',
  deliveryNote: '',
  isDefault: false
}

const AddressesTab = () => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)
  const [detailModal, setDetailModal] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [modalMode, setModalMode] = useState('create')
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [modalInitializing, setModalInitializing] = useState(false)

  const showToast = (type, text) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3000)
  }

  const mapAddress = (addr) => {
    if (!addr) return null
    return {
      id: addr.id,
      recipientName: addr.recipientName,
      recipientPhone: addr.recipientPhone,
      addressLine: addr.addressLine,
      ward: addr.ward,
      districtName: addr.districtName,
      cityName: addr.cityName,
      isDefault: addr.isDefault,
      deliveryNote: addr.deliveryNote
    }
  }

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAddresses()
      const payload = response?.data ?? response ?? []
      const list = Array.isArray(payload) ? payload : payload.items ?? []
      setAddresses(list.map(mapAddress).filter(Boolean))
      setFetchError(null)
    } catch (err) {
      setFetchError(err?.message || 'Không thể tải danh sách địa chỉ.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await getCities()
        const list = response?.data ?? response ?? []
        setCities(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Không thể tải danh sách tỉnh/thành phố:', err)
      }
    }
    loadCities()
  }, [])

  const handleCityChange = async (e) => {
    const [city, cityName] = e.target.value.split('|')
    setFormData((prev) => ({
      ...prev,
      city,
      cityName,
      district: '',
      districtName: '',
      wardCode: '',
      ward: ''
    }))
    setDistricts([])
    setWards([])

    if (city) {
      try {
        const response = await getDistrictsByCity(city)
        const list = response?.data ?? response ?? []
        setDistricts(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Không thể tải quận/huyện:', err)
      }
    }
  }

  const handleDistrictChange = async (e) => {
    const [district, districtName] = e.target.value.split('|')
    setFormData((prev) => ({
      ...prev,
      district,
      districtName,
      wardCode: '',
      ward: ''
    }))
    setWards([])

    if (district) {
      try {
        const response = await getWardsByDistrict(district)
        const list = response?.data ?? response ?? []
        setWards(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Không thể tải phường/xã:', err)
      }
    }
  }

  const handleWardChange = (e) => {
    const [wardCode, ward] = e.target.value.split('|')
    setFormData((prev) => ({
      ...prev,
      wardCode,
      ward
    }))
  }

  const handleOpenModal = () => {
    setFormData(initialForm)
    setError(null)
    setModalMode('create')
    setEditingAddressId(null)
    setModalInitializing(false)
    setDistricts([])
    setWards([])
    setShowModal(true)
  }

  const handleCloseModal = () => {
    if (submitting) return
    setShowModal(false)
    setError(null)
    setModalMode('create')
    setEditingAddressId(null)
    setModalInitializing(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const isValid = useMemo(() => {
    return (
      formData.recipientName.trim() &&
      formData.recipientPhone.trim() &&
      formData.addressLine.trim() &&
      formData.ward.trim() &&
      formData.wardCode &&
      formData.district &&
      formData.districtName.trim() &&
      formData.city &&
      formData.cityName.trim()
    )
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    try {
      setSubmitting(true)
      const payload = {
        ...formData,
        wardCode: Number(formData.wardCode),
        district: Number(formData.district),
        city: Number(formData.city)
      }

      if (Number.isNaN(payload.wardCode) || Number.isNaN(payload.district) || Number.isNaN(payload.city)) {
        setError('Phường/Xã, Quận/Huyện, Tỉnh/Thành phố cần nhập mã số hợp lệ.')
        setSubmitting(false)
        return
      }

      if (modalMode === 'edit' && editingAddressId) {
        await updateAddress(editingAddressId, payload)
        showToast('success', 'Đã cập nhật địa chỉ.')
      } else {
        await createAddress(payload)
        showToast('success', 'Đã thêm địa chỉ mới.')
      }
      setShowModal(false)
      setFormData(initialForm)
      setError(null)
      setModalMode('create')
      setEditingAddressId(null)
      fetchAddresses()
    } catch (err) {
      setError(err?.message || 'Không thể lưu địa chỉ. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    setConfirmModal({
      type: 'delete',
      title: 'Xóa địa chỉ?',
      message: 'Địa chỉ này sẽ bị xóa khỏi tài khoản của bạn.',
      actionLabel: 'Xóa',
      targetId: addressId
    })
  }

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId)
      showToast('success', 'Đã đặt làm địa chỉ mặc định.')
      fetchAddresses()
    } catch (err) {
      showToast('error', err?.message || 'Không thể đặt mặc định.')
    }
  }

  const handleViewDetail = async (addressId) => {
    setDetailModal({ loading: true, data: null, error: null })
    try {
      const response = await getAddressDetail(addressId)
      const detail = response?.data ?? response ?? null
      setDetailModal({ loading: false, data: detail, error: null })
    } catch (err) {
      setDetailModal({ loading: false, data: null, error: err?.message || 'Không thể tải chi tiết địa chỉ.' })
    }
  }

  const preloadDistrictsAndWards = useCallback(
    async (cityId, districtId) => {
      if (cityId) {
        try {
          const response = await getDistrictsByCity(cityId)
          const list = response?.data ?? response ?? []
          setDistricts(Array.isArray(list) ? list : [])
        } catch (err) {
          console.error('Không thể tải quận/huyện:', err)
          setDistricts([])
        }
      } else {
        setDistricts([])
      }

      if (districtId) {
        try {
          const response = await getWardsByDistrict(districtId)
          const list = response?.data ?? response ?? []
          setWards(Array.isArray(list) ? list : [])
        } catch (err) {
          console.error('Không thể tải phường/xã:', err)
          setWards([])
        }
      } else {
        setWards([])
      }
    },
    []
  )

  const handleEditAddress = async (address) => {
    if (!address?.id) return
    setModalMode('edit')
    setEditingAddressId(address.id)
    setShowModal(true)
    setModalInitializing(true)
    setError(null)
    try {
      const response = await getAddressDetail(address.id)
      const detail = response?.data ?? response ?? {}

      await preloadDistrictsAndWards(detail.city, detail.district)

      setFormData({
        recipientName: detail.recipientName || '',
        recipientPhone: detail.recipientPhone || '',
        addressLine: detail.addressLine || '',
        ward: detail.ward || '',
        wardCode: detail.wardCode ? String(detail.wardCode) : '',
        district: detail.district ? String(detail.district) : '',
        districtName: detail.districtName || '',
        city: detail.city ? String(detail.city) : '',
        cityName: detail.cityName || '',
        deliveryNote: detail.deliveryNote || '',
        isDefault: Boolean(detail.isDefault)
      })
    } catch (err) {
      setError(err?.message || 'Không thể tải thông tin địa chỉ.')
    } finally {
      setModalInitializing(false)
    }
  }

  const handleConfirmAction = async () => {
    if (!confirmModal) return
    try {
      if (confirmModal.type === 'delete') {
        await deleteAddress(confirmModal.targetId)
        showToast('success', 'Đã xóa địa chỉ.')
      }
      fetchAddresses()
    } catch (err) {
      showToast('error', err?.message || 'Không thể thực hiện thao tác.')
    } finally {
      setConfirmModal(null)
    }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
        {toast && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}
          >
            {toast.text}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Địa chỉ của tôi</h2>
          <motion.button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
          >
            <span className="text-xl">+</span> Thêm địa chỉ mới
          </motion.button>
        </div>

        <AddressList
          addresses={addresses}
          loading={loading}
          fetchError={fetchError}
          onRetry={fetchAddresses}
          onAddNew={handleOpenModal}
          onViewDetail={handleViewDetail}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
          onSetDefault={handleSetDefault}
        />
      </motion.div>

      <AddAddressModal
        open={showModal}
        formData={formData}
        cities={cities}
        districts={districts}
        wards={wards}
        submitting={submitting}
        error={error}
        isValid={isValid}
        mode={modalMode}
        loadingDetail={modalInitializing}
        onClose={handleCloseModal}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCityChange={handleCityChange}
        onDistrictChange={handleDistrictChange}
        onWardChange={handleWardChange}
      />

      <AddressConfirmModal modal={confirmModal} onCancel={() => setConfirmModal(null)} onConfirm={handleConfirmAction} />

      <AddressDetailModal modal={detailModal} onClose={() => setDetailModal(null)} />
    </>
  )
}

export default AddressesTab

