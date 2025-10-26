import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  Upload,
  message,
  Row,
  Col,
  Divider
} from 'antd'
import { 
  PlusOutlined,
  EditOutlined,
  TagOutlined,
  DollarOutlined,
  HomeOutlined,
  IdcardOutlined
} from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

const ProductEdit = ({ visible, onClose, onUpdate, product }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        condition: product.condition,
        size: product.size,
        color: product.color,
        material: product.material,
        weight: product.weight,
        dimensions: product.dimensions,
        location: product.location,
        originalPrice: product.originalPrice,
        price: product.price,
        tags: product.tags || []
      })
      
      // Set existing images
      if (product.images) {
        setFileList(product.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url
        })))
      }
    }
  }, [visible, product, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      const updatedProduct = {
        ...product,
        ...values,
        images: fileList.map(file => file.url || URL.createObjectURL(file.originFileObj)),
        ecoPoints: Math.floor(values.price / 10000) * 5
      }
      
      onUpdate(updatedProduct)
      
      message.success('Cập nhật sản phẩm thành công!')
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    onClose()
  }

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  )

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
          <span className="font-bold">SP-{String(product.id).padStart(4, '0')}</span>
        </div>
        <div className="text-xs text-blue-600">
          Quyên góp: {new Date(product.donationDate).toLocaleDateString('vi-VN')}
        </div>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        {/* Images Upload */}
        <Form.Item
          label={<span className="font-medium">Hình ảnh sản phẩm</span>}
          tooltip="Tải lên tối đa 5 ảnh, ảnh đầu tiên sẽ là ảnh đại diện"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            maxCount={5}
          >
            {fileList.length >= 5 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Row gutter={16}>
          {/* Tên sản phẩm */}
          <Col span={24}>
            <Form.Item
              name="name"
              label={<span className="font-medium">Tên sản phẩm</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                { min: 5, message: 'Tên sản phẩm phải có ít nhất 5 ký tự!' }
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
                { required: true, message: 'Vui lòng nhập mô tả!' },
                { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' }
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>

          {/* Danh mục */}
          <Col span={12}>
            <Form.Item
              name="category"
              label={<span className="font-medium">Danh mục</span>}
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục" size="large">
                <Option value="Thời trang">Thời trang</Option>
                <Option value="Giày dép">Giày dép</Option>
                <Option value="Phụ kiện">Phụ kiện</Option>
                <Option value="Sách & Văn phòng phẩm">Sách & Văn phòng phẩm</Option>
                <Option value="Đồ gia dụng">Đồ gia dụng</Option>
                <Option value="Điện tử">Điện tử</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Thương hiệu */}
          <Col span={12}>
            <Form.Item
              name="brand"
              label={<span className="font-medium">Thương hiệu</span>}
              rules={[{ required: true, message: 'Vui lòng nhập thương hiệu!' }]}
            >
              <Input 
                placeholder="Nhập thương hiệu" 
                size="large"
              />
            </Form.Item>
          </Col>

          {/* Tình trạng */}
          <Col span={8}>
            <Form.Item
              name="condition"
              label={<span className="font-medium">Tình trạng</span>}
              rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
            >
              <Select placeholder="Chọn tình trạng" size="large">
                <Option value="Rất tốt">Rất tốt</Option>
                <Option value="Tốt">Tốt</Option>
                <Option value="Khá">Khá</Option>
                <Option value="Cần sửa chữa">Cần sửa chữa</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Size */}
          <Col span={8}>
            <Form.Item
              name="size"
              label={<span className="font-medium">Size</span>}
              rules={[{ required: true, message: 'Vui lòng nhập size!' }]}
            >
              <Input 
                placeholder="M, L, XL, ..." 
                size="large"
              />
            </Form.Item>
          </Col>

          {/* Màu sắc */}
          <Col span={8}>
            <Form.Item
              name="color"
              label={<span className="font-medium">Màu sắc</span>}
              rules={[{ required: true, message: 'Vui lòng nhập màu sắc!' }]}
            >
              <Input 
                placeholder="Đỏ, Xanh, ..." 
                size="large"
              />
            </Form.Item>
          </Col>

          {/* Chất liệu */}
          <Col span={12}>
            <Form.Item
              name="material"
              label={<span className="font-medium">Chất liệu</span>}
              rules={[{ required: true, message: 'Vui lòng nhập chất liệu!' }]}
            >
              <Input 
                placeholder="Cotton, Da, Vải, ..." 
                size="large"
              />
            </Form.Item>
          </Col>

          {/* Trọng lượng */}
          <Col span={12}>
            <Form.Item
              name="weight"
              label={<span className="font-medium">Trọng lượng (kg)</span>}
              rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
            >
              <InputNumber
                placeholder="0.5"
                size="large"
                className="w-full"
                min={0}
                step={0.1}
              />
            </Form.Item>
          </Col>

          {/* Kích thước */}
          <Col span={12}>
            <Form.Item
              name="dimensions"
              label={<span className="font-medium">Kích thước</span>}
              rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
            >
              <Input 
                placeholder="60x50x2 cm" 
                size="large"
              />
            </Form.Item>
          </Col>

          {/* Kho */}
          <Col span={12}>
            <Form.Item
              name="location"
              label={
                <span className="font-medium">
                  <HomeOutlined className="mr-2 text-gray-400" />
                  Kho lưu trữ
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn kho!' }]}
            >
              <Select placeholder="Chọn kho" size="large">
                <Option value="Kho TP.HCM">Kho TP.HCM</Option>
                <Option value="Kho Hà Nội">Kho Hà Nội</Option>
                <Option value="Kho Đà Nẵng">Kho Đà Nẵng</Option>
                <Option value="Kho Cần Thơ">Kho Cần Thơ</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Giá gốc */}
          <Col span={12}>
            <Form.Item
              name="originalPrice"
              label={
                <span className="font-medium">
                  <DollarOutlined className="mr-2 text-gray-400" />
                  Giá gốc (VNĐ)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập giá gốc!' },
                { type: 'number', min: 1000, message: 'Giá gốc phải lớn hơn 1,000 VNĐ!' }
              ]}
            >
              <InputNumber
                placeholder="500000"
                size="large"
                className="w-full"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
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
                { type: 'number', min: 1000, message: 'Giá bán phải lớn hơn 1,000 VNĐ!' }
              ]}
            >
              <InputNumber
                placeholder="150000"
                size="large"
                className="w-full"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>

          {/* Tags */}
          <Col span={24}>
            <Form.Item
              name="tags"
              label={<span className="font-medium">Tags (Nhấn Enter để thêm)</span>}
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Nhập tags và nhấn Enter"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Statistics Info */}
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
              <span className="font-medium">Lượt thích:</span>{' '}
              <span className="text-red-600 font-bold">{product.likes || 0}</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-gray-600">
              <span className="font-medium">Eco Points:</span>{' '}
              <span className="text-yellow-600 font-bold">{product.ecoPoints || 0} EP</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Last Updated Info */}
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <span className="font-medium">Cập nhật lần cuối:</span>{' '}
          {new Date().toLocaleString('vi-VN')}
        </div>
      </div>
    </Modal>
  )
}

export default ProductEdit

