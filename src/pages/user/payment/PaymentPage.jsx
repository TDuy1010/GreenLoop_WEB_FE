import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAddresses } from '../../../service/api/addressApi'
import { isAuthenticated } from '../../../service/api/authApi'
import { estimateShipping, checkoutCart } from '../../../service/api/cartApi'
import PaymentStepper from './components/PaymentStepper'
import AddressSelector from './components/AddressSelector'
import ShippingOptions from './components/ShippingOptions'
import PaymentMethodList from './components/PaymentMethodList'
import CheckoutSummary from './components/CheckoutSummary'

const paymentOptions = [
  {
    id: 'COD',
    title: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán tiền mặt trực tiếp cho shipper khi nhận sản phẩm.',
    badge: 'Phổ biến nhất'
  },
  {
    id: 'PAYOS',
    title: 'Thanh toán qua PayOS',
    description: 'Sử dụng cổng PayOS để thanh toán trực tuyến nhanh chóng và an toàn.',
    badge: 'Khuyến khích'
  }
]

const steps = [
  { id: 1, title: 'Chọn địa chỉ giao hàng', description: 'Đảm bảo thông tin nhận hàng chính xác.' },
  { id: 2, title: 'Chọn hình thức vận chuyển', description: 'Ước tính phí phù hợp với địa chỉ đã chọn.' },
  { id: 3, title: 'Chọn phương thức thanh toán', description: 'Hoàn tất đơn hàng của bạn.' }
]

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`

const PaymentPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [addressError, setAddressError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [shippingOptions, setShippingOptions] = useState([])
  const [selectedShippingOption, setSelectedShippingOption] = useState(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState(null)
  const [shippingSummary, setShippingSummary] = useState({
    productTotal: 0,
    shippingFee: 0,
    totalPrice: 0,
    selectedCarrier: null,
    estimatedDelivery: null
  })
  const [checkoutResult, setCheckoutResult] = useState(null)
  const [checkoutError, setCheckoutError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true, state: { from: '/payment' } })
      return
    }

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true)
        const response = await getAddresses()
        const payload = response?.data ?? response ?? []
        const list = Array.isArray(payload) ? payload : payload.items ?? []
        setAddresses(list)

        const defaultAddress = list.find((addr) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        }
      } catch (err) {
        setAddressError(err?.message || 'Không thể tải danh sách địa chỉ.')
      } finally {
        setLoadingAddresses(false)
      }
    }

    fetchAddresses()
  }, [navigate])

  const selectedAddress = useMemo(() => {
    return addresses.find((addr) => addr.id === selectedAddressId) || null
  }, [addresses, selectedAddressId])

  const handleEstimateShipping = useCallback(
    async (address) => {
      if (!address) {
        setShippingOptions([])
        setSelectedShippingOption(null)
        return
      }

      const cityCode = address.cityCode ?? address.city
      const districtCode = address.districtCode ?? address.district

      if (!cityCode || !districtCode) {
        setShippingError('Địa chỉ chưa đủ thông tin khu vực để ước tính phí vận chuyển.')
        setShippingOptions([])
        setSelectedShippingOption(null)
        return
      }

      try {
        setShippingLoading(true)
        setShippingError(null)
        const response = await estimateShipping({
          cityCode: String(cityCode),
          districtCode: String(districtCode)
        })
        const payload = response?.data ?? response ?? {}
        const data = payload.data ?? payload
        setShippingSummary({
          productTotal: data.productTotal ?? 0,
          shippingFee: data.shippingFee ?? 0,
          totalPrice: data.totalPrice ?? 0,
          selectedCarrier: data.selectedCarrier ?? null,
          estimatedDelivery: data.estimatedDelivery ?? null
        })
        const options = data.availableOptions ?? []
        setShippingOptions(options)
        setSelectedShippingOption((prev) => {
          if (!options.length) return null
          if (!prev) return options[0]
          const existing = options.find((opt) => opt.rateId === prev.rateId)
          return existing || options[0]
        })
      } catch (error) {
        setShippingError(error?.message || 'Không thể ước tính phí vận chuyển.')
        setShippingOptions([])
        setSelectedShippingOption(null)
      } finally {
        setShippingLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!selectedAddress) {
      setShippingOptions([])
      setSelectedShippingOption(null)
      return
    }
    handleEstimateShipping(selectedAddress)
  }, [selectedAddress, handleEstimateShipping])

  const totals = useMemo(() => {
    const productTotal = Number(shippingSummary.productTotal || 0)
    const summaryDelta =
      shippingSummary.totalPrice && shippingSummary.totalPrice >= productTotal
        ? shippingSummary.totalPrice - productTotal
        : 0
    const includeShipping = currentStep >= 2 && selectedShippingOption
    const shippingFee = includeShipping
      ? selectedShippingOption?.fee ?? shippingSummary.shippingFee ?? summaryDelta ?? 0
      : 0
    return {
      productTotal,
      shippingFee: Number(shippingFee || 0),
      total: productTotal + Number(shippingFee || 0)
    }
  }, [currentStep, selectedShippingOption, shippingSummary])

  const canGoNext = useMemo(() => {
    if (currentStep === 1) return Boolean(selectedAddressId)
    if (currentStep === 2) return Boolean(selectedShippingOption)
    if (currentStep === 3) return Boolean(selectedPaymentMethod)
    return false
  }, [currentStep, selectedAddressId, selectedPaymentMethod, selectedShippingOption])

  const goToAddressManager = useCallback(() => {
    navigate('/profile', { state: { tab: 'addresses' } })
  }, [navigate])

  const handleNext = () => {
    if (!canGoNext) return
    if (currentStep === steps.length) return
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (currentStep === 1) return
    setCurrentStep((prev) => prev - 1)
  }

  const buildShippingAddressPayload = (address) => {
    if (!address) return null
    return {
      receiverName: address.recipientName,
      receiverPhone: address.recipientPhone,
      address: address.addressLine,
      ward: address.ward || address.wardName,
      wardCode: address.wardCode || address.ward,
      districtName: address.districtName,
      districtId: address.districtId || address.districtCode || address.district,
      cityName: address.cityName,
      cityId: address.cityId || address.cityCode || address.city,
      note: address.deliveryNote || address.note || ''
    }
  }

  const handleConfirm = async () => {
    if (currentStep !== steps.length) return
    if (!selectedAddress || !selectedPaymentMethod || !selectedShippingOption) return

    const payload = {
      shippingAddress: buildShippingAddressPayload(selectedAddress),
      paymentMethod: selectedPaymentMethod,
      selectedRateId: selectedShippingOption.rateId
    }

    setProcessing(true)
    setCheckoutResult(null)
    setCheckoutError(null)
    try {
      const response = await checkoutCart(payload)
      const body = response?.data ?? response ?? {}
      const result = body.data ?? body
      setCheckoutResult(result)

      // Log để debug
      console.log('Checkout Response:', result)
      console.log('orderId:', result.orderId)
      console.log('orderCode:', result.orderCode)
      console.log('Total Price từ API:', result.totalPrice)
      console.log('Shipping Fee từ API:', result.shippingFee)
      console.log('Product Total từ API:', result.productTotal)
      console.log('Tổng tính toán ở frontend:', totals.total)
      
      // Kiểm tra xem số tiền có khớp không
      if (result.totalPrice && totals.total && Math.abs(result.totalPrice - totals.total) > 1000) {
        console.warn('⚠️ Số tiền không khớp! Frontend:', totals.total, 'Backend:', result.totalPrice)
      }

      if (selectedPaymentMethod === 'PAYOS' && result.paymentUrl) {
        // Chuyển hướng sang trang thanh toán PayOS trên cùng tab
        window.location.href = result.paymentUrl
      } else if (selectedPaymentMethod === 'COD') {
        // Đặt hàng bằng COD -> chuyển sang trang đặt hàng thành công
        navigate('/orders/success', {
          state: { orderId: result.orderId, orderCode: result.orderCode }
        })
      } else {
        // Các phương thức khác (nếu sau này có)
        navigate('/orders', {
          state: { success: true, orderId: result.orderId, orderCode: result.orderCode }
        })
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Không thể hoàn tất thanh toán.'
      setCheckoutError(message)
    } finally {
      setProcessing(false)
    }
  }

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Chọn địa chỉ giao hàng</h2>
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            loading={loadingAddresses}
            error={addressError}
            onSelect={setSelectedAddressId}
            onAddNewAddress={goToAddressManager}
            onManageAddress={goToAddressManager}
          />
        </>
      )
    }

    if (currentStep === 2) {
      return (
        <>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Chọn hình thức vận chuyển</h2>
          <ShippingOptions
            selectedAddress={selectedAddress}
            options={shippingOptions}
            selectedOption={selectedShippingOption}
            loading={shippingLoading}
            error={shippingError}
            onSelectOption={setSelectedShippingOption}
            onRetry={() => selectedAddress && handleEstimateShipping(selectedAddress)}
            formatCurrency={formatCurrency}
          />
        </>
      )
    }

    return (
      <>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Chọn phương thức thanh toán</h2>
        <PaymentMethodList
          methods={paymentOptions}
          selectedMethod={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
        />
      </>
    )
  }
  const canConfirm =
    currentStep === steps.length && Boolean(selectedPaymentMethod && selectedShippingOption)

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-500 font-semibold">Thanh toán</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Hoàn tất đơn hàng của bạn</h1>
          <p className="text-slate-500 mt-2">Chỉ còn vài bước để GreenLoop giao sản phẩm đến bạn.</p>
        </div>

        <PaymentStepper steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-emerald-500 font-semibold">
                  Bước {currentStep}/{steps.length}
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{steps[currentStep - 1].title}</h2>
              </div>
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <button
                    className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={handleBack}
                  >
                    Quay lại
                  </button>
                )}
                {currentStep < steps.length && (
                  <button
                    className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-60"
                    disabled={!canGoNext}
                    onClick={handleNext}
                  >
                    Tiếp tục
                  </button>
                )}
              </div>
            </div>
            {renderStepContent()}
          </div>
          <CheckoutSummary
            selectedAddress={selectedAddress}
            selectedShippingOption={selectedShippingOption}
            selectedPaymentMethod={selectedPaymentMethod}
            totals={totals}
            paymentOptions={paymentOptions}
            currentStep={currentStep}
            processing={processing}
            onBack={handleBack}
            onConfirm={handleConfirm}
            canConfirm={canConfirm}
            formatCurrency={formatCurrency}
            checkoutResult={checkoutResult}
            checkoutError={checkoutError}
          />
        </div>
      </div>
    </section>
  )
}

export default PaymentPage

