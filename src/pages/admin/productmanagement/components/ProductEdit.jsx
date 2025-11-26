import React, { useEffect, useMemo, useState } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  message,
  Row,
  Col,
  Divider
} from 'antd'
import {
  EditOutlined,
  TagOutlined,
  DollarOutlined,
  IdcardOutlined
} from '@ant-design/icons'
import { updateProduct } from '../../../../service/api/productApi'
import { getAllCategories } from '../../../../service/api/categoryApi'

const { Option } = Select
const { TextArea } = Input

const ProductEdit = ({ visible, onClose, onUpdate, product }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [categoryOptions, setCategoryOptions] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(false)

  const conditionOptions = useMemo(
    () => [
      { value: 'NEW', label: 'Mới' },
      { value: 'LIKE_NEW', label: 'Như mới' },
      { value: 'GOOD', label: 'Tốt' },
      { value: 'FAIR', label: 'Khá' },
      { value: 'POOR', label: 'Cần sửa chữa' }
    ],
    []
  )

  const typeOptions = [
    { value: 'CHARITY', label: 'Quyên góp' },
    { value: 'RESALE', label: 'Mua bán' }
  ]

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'AVAILABLE', label: 'Có sẵn' },
    { value: 'SOLD', label: 'Đã bán' },
    { value: 'UNAVAILABLE', label: 'Không khả dụng' }
  ]

  useEffect(() => {
    if (!visible) return
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true)
        const response = await getAllCategories()
        const payload = response?.data ?? response ?? []
        const list = Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload.content)
            ? payload.content
            : Array.isArray(payload)
              ? payload
              : []
        const normalized = list.map((item, index) => ({
          value: item.id ?? item.categoryId ?? index,
          label: item.name ?? item.categoryName ?? `Danh mục ${index + 1}`
        }))
        setCategoryOptions(normalized)
      } catch (error) {
        console.error('❌ Lỗi tải danh mục:', error)
        message.error(error?.message || 'Không thể tải danh mục')
      } finally {
        setCategoryLoading(false)
      }
    }

    fetchCategories()
  }, [visible])

  useEffect(() => {
    if (visible && product) {
      // Map dữ liệu từ product vào form
      form.setFieldsValue({
        productName: product.productName || product.name || '',
        description: product.description || '',
        categoryId: product.categoryId || product.category?.id || null,
        type: product.typeValue || product.type || 'CHARITY',
        status: product.statusValue || product.status || 'PENDING',
        conditionGrade: product.conditionGradeValue || product.condition || 'LIKE_NEW',
        price: product.price || 0,
        ecoPointValue: product.ecoPointValue || product.ecoPoints || 0,
        donationItemCode: product.donationItemCode || ''
      })
    }
  }, [visible, product, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.log('Form values:', values)
      setLoading(true)

      // Kiểm tra và validate các giá trị bắt buộc theo schema API
      if (!values.categoryId) {
        message.error('Vui lòng chọn danh mục!')
        setLoading(false)
        return
      }

      if (!values.type) {
        message.error('Vui lòng chọn loại sản phẩm!')
        setLoading(false)
        return
      }

      if (!values.status) {
        message.error('Vui lòng chọn trạng thái!')
        setLoading(false)
        return
      }

      if (!values.conditionGrade) {
        message.error('Vui lòng chọn tình trạng!')
        setLoading(false)
        return
      }

      if (values.price === undefined || values.price === null || Number(values.price) < 0) {
        message.error('Vui lòng nhập giá bán hợp lệ (>= 0)!')
        setLoading(false)
        return
      }

      if (values.ecoPointValue === undefined || values.ecoPointValue === null || Number(values.ecoPointValue) < 0) {
        message.error('Vui lòng nhập Eco Points hợp lệ (>= 0)!')
        setLoading(false)
        return
      }

      // Validate productName
      if (!values.productName || !values.productName.trim()) {
        message.error('Vui lòng nhập tên sản phẩm!')
        setLoading(false)
        return
      }

      if (values.productName.trim().length > 150) {
        message.error('Tên sản phẩm không được vượt quá 150 ký tự!')
        setLoading(false)
        return
      }

      // Validate description nếu có (0-2000 characters)
      if (values.description && values.description.trim().length > 2000) {
        message.error('Mô tả không được vượt quá 2000 ký tự!')
        setLoading(false)
        return
      }

      // Validate donationItemCode
      if (!values.donationItemCode || !values.donationItemCode.trim()) {
        message.error('Vui lòng nhập mã quyên góp!')
        setLoading(false)
        return
      }

      if (values.donationItemCode.trim().length < 1) {
        message.error('Mã quyên góp phải có ít nhất 1 ký tự!')
        setLoading(false)
        return
      }

      // Tạo request payload theo schema API
      const requestPayload = {
        categoryId: Number(values.categoryId),
        type: String(values.type).toUpperCase(),
        status: String(values.status).toUpperCase(),
        conditionGrade: String(values.conditionGrade).toUpperCase(),
        price: Number(values.price),
        ecoPointValue: Number(values.ecoPointValue),
        productName: values.productName.trim(),
        description: values.description?.trim() || '',
        donationItemCode: values.donationItemCode.trim()
      }

      console.log('Update Payload:', requestPayload)

      // Gọi API update
      const response = await updateProduct(product.id, requestPayload)
      const body = response?.data ?? response ?? {}
      const updatedProduct = body.data ?? body

      if (onUpdate && updatedProduct) {
        onUpdate(updatedProduct)
      }
      
      message.success(body.message || 'Cập nhật sản phẩm thành công!')
      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation failed or update error:', error)
      const errMsg = error?.response?.data?.message || error?.message
      const errors = error?.response?.data?.errors || []
      if (errors.length > 0) {
        message.error(errors.join(', '))
      } else {
        message.error(errMsg || 'Vui lòng kiểm tra lại thông tin!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  if (!product) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <EditOutlined className="text-blue-600" />
          <span>Chỉnh sửa sản phẩm</span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={900}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={loading}
      okButtonProps={{
        className: 'bg-blue-600 hover:bg-blue-700'
      }}
    >
      <Divider className="mt-4 mb-6" />

      {/* Product ID Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <IdcardOutlined />
          <span className="font-medium">Mã sản phẩm:</span>
          <span className="font-bold">{product.code || `SP-${String(product.id).padStart(4, '0')}`}</span>
        </div>
        {product.donationItemCode && (
          <div className="text-xs text-blue-600">
            Mã quyên góp: {product.donationItemCode}
          </div>
        )}
      </div>
      
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Row gutter={16}>
          {/* Tên sản phẩm */}
          <Col span={24}>
            <Form.Item
              name="productName"
              label={<span className="font-medium">Tên sản phẩm</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                { max: 150, message: 'Tên sản phẩm không được vượt quá 150 ký tự!' }
              ]}
            >
              <Input 
                placeholder="Nhập tên sản phẩm" 
                size="large"
                prefix={<TagOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>

          {/* Mô tả */}
          <Col span={24}>
            <Form.Item
              name="description"
              label={<span className="font-medium">Mô tả sản phẩm</span>}
              rules={[
                { max: 2000, message: 'Mô tả không được vượt quá 2000 ký tự!' }
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                maxLength={2000}
                showCount
              />
            </Form.Item>
          </Col>

          {/* Danh mục */}
          <Col span={12}>
            <Form.Item
              name="categoryId"
              label={<span className="font-medium">Danh mục</span>}
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select
                placeholder="Chọn danh mục"
                size="large"
                loading={categoryLoading}
                notFoundContent={categoryLoading ? 'Đang tải...' : 'Không có danh mục'}
              >
                {categoryOptions.map((category) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Tình trạng */}
          <Col span={8}>
            <Form.Item
              name="conditionGrade"
              label={<span className="font-medium">Tình trạng</span>}
              rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
            >
              <Select placeholder="Chọn tình trạng" size="large">
                {conditionOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Trạng thái */}
          <Col span={8}>
            <Form.Item
              name="status"
              label={<span className="font-medium">Trạng thái</span>}
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái" size="large">
                {statusOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Loại sản phẩm */}
          <Col span={8}>
            <Form.Item
              name="type"
              label={<span className="font-medium">Loại sản phẩm</span>}
              rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
            >
              <Select placeholder="Chọn loại" size="large">
                {typeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Giá bán */}
          <Col span={12}>
            <Form.Item
              name="price"
              label={
                <span className="font-medium">
                  <DollarOutlined className="mr-2 text-gray-400" />
                  Giá bán (VNĐ)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập giá bán!' },
                { type: 'number', min: 0, message: 'Giá bán phải >= 0!' }
              ]}
            >
              <InputNumber
                placeholder="150000"
                size="large"
                className="w-full"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                step={0.01}
              />
            </Form.Item>
          </Col>

          {/* Eco Points */}
          <Col span={12}>
            <Form.Item
              name="ecoPointValue"
              label={<span className="font-medium">Eco Points</span>}
              rules={[{ required: true, message: 'Vui lòng nhập Eco Points!' }]}
            >
              <InputNumber
                placeholder="10"
                size="large"
                className="w-full"
                min={0}
                step={1}
              />
            </Form.Item>
          </Col>

          {/* Donation Item Code */}
          <Col span={12}>
            <Form.Item
              name="donationItemCode"
              label={<span className="font-medium">Mã quyên góp</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập mã quyên góp!' },
                { min: 1, message: 'Mã quyên góp phải có ít nhất 1 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập mã quyên góp" size="large" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Statistics Info */}
      {product.views !== undefined && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Row gutter={16} className="text-xs">
            <Col span={8}>
              <div className="text-gray-600">
                <span className="font-medium">Lượt xem:</span>{' '}
                <span className="text-blue-600 font-bold">{product.views || 0}</span>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-gray-600">
                <span className="font-medium">Eco Points:</span>{' '}
                <span className="text-yellow-600 font-bold">{product.ecoPointValue || product.ecoPoints || 0} EP</span>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-gray-600">
                <span className="font-medium">Trạng thái:</span>{' '}
                <span className="text-green-600 font-bold">{statusOptions.find(s => s.value === product.status)?.label || product.status}</span>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  )
}

export default ProductEdit
