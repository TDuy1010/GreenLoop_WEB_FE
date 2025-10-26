import React, { useState } from 'react'
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
  AppstoreOutlined,
  TagOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  HomeOutlined
} from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

const ProductAdd = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Format data
      const newProduct = {
        ...values,
        id: Date.now(),
        images: fileList.map(file => file.url || URL.createObjectURL(file.originFileObj)),
        donationDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        isApproved: false,
        views: 0,
        likes: 0,
        ecoPoints: Math.floor(values.price / 10000) * 5
      }
      
      onAdd(newProduct)
      
      message.success('Thêm sản phẩm thành công!')
      form.resetFields()
      setFileList([])
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

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <AppstoreOutlined className="text-green-600" />
          <span>Thêm sản phẩm mới</span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={900}
      okText="Thêm sản phẩm"
      cancelText="Hủy"
      confirmLoading={loading}
      okButtonProps={{
        className: 'bg-green-600 hover:bg-green-700'
      }}
    >
      <Divider className="mt-4 mb-6" />
      
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
    </Modal>
  )
}

export default ProductAdd

