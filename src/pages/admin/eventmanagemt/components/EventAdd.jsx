import React, { useState } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Upload,
  message
} from 'antd'
import { 
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const EventAdd = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // Format dates and times
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm'),
        image: imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        registeredCount: 0,
        coordinates: { lat: 0, lng: 0 }, // Default coordinates, should be set based on address
        id: Date.now() // Generate temporary ID
      }

      await onAdd(formattedValues)
      message.success('Thêm sự kiện thành công!')
      form.resetFields()
      setImageUrl(null)
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      // Get image URL from response
      setImageUrl(info.file.response?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400')
      message.success('Tải ảnh lên thành công!')
    } else if (info.file.status === 'error') {
      message.error('Tải ảnh lên thất bại!')
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <PlusOutlined className="text-green-600" />
          <span>Thêm sự kiện mới</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700"
        >
          Thêm sự kiện
        </Button>
      ]}
      width={800}
      className="event-add-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        {/* Image Upload */}
        <Form.Item
          label="Hình ảnh sự kiện"
          name="image"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            onChange={handleImageChange}
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />
              <div className="mt-2">Tải ảnh lên</div>
            </div>
          </Upload>
        </Form.Item>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Tên sự kiện"
            name="title"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sự kiện!' },
              { min: 5, message: 'Tên sự kiện phải có ít nhất 5 ký tự!' }
            ]}
            className="col-span-2"
          >
            <Input placeholder="Nhập tên sự kiện" size="large" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' }
            ]}
            className="col-span-2"
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập mô tả chi tiết về sự kiện"
            />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục" size="large">
              <Option value="workshop">Hội thảo</Option>
              <Option value="collection">Thu gom</Option>
              <Option value="seminar">Tọa đàm</Option>
              <Option value="volunteer">Tình nguyện</Option>
              <Option value="campaign">Chiến dịch</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái" size="large">
              <Option value="upcoming">Sắp diễn ra</Option>
              <Option value="active">Đang diễn ra</Option>
              <Option value="completed">Đã kết thúc</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày tổ chức"
            name="date"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker 
              className="w-full" 
              size="large"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
            />
          </Form.Item>

          <Form.Item
            label="Thời gian"
            className="col-span-1"
          >
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                name="startTime"
                rules={[{ required: true, message: 'Chọn giờ bắt đầu!' }]}
                className="mb-0"
              >
                <TimePicker 
                  className="w-full" 
                  size="large"
                  format="HH:mm"
                  placeholder="Giờ bắt đầu"
                />
              </Form.Item>
              <Form.Item
                name="endTime"
                rules={[{ required: true, message: 'Chọn giờ kết thúc!' }]}
                className="mb-0"
              >
                <TimePicker 
                  className="w-full" 
                  size="large"
                  format="HH:mm"
                  placeholder="Giờ kết thúc"
                />
              </Form.Item>
            </div>
          </Form.Item>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Địa điểm"
            name="location"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
          >
            <Input placeholder="Tên địa điểm" size="large" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ chi tiết"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Địa chỉ đầy đủ" size="large" />
          </Form.Item>
        </div>

        {/* Organizer & Participants */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Người tổ chức"
            name="organizer"
            rules={[{ required: true, message: 'Vui lòng nhập người tổ chức!' }]}
          >
            <Input placeholder="Tên người/đơn vị tổ chức" size="large" />
          </Form.Item>

          <Form.Item
            label="Số lượng tối đa"
            name="maxParticipants"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
            ]}
          >
            <InputNumber 
              placeholder="Số người tham gia tối đa" 
              className="w-full"
              size="large"
              min={1}
            />
          </Form.Item>

          <Form.Item
            label="Phí tham gia (VNĐ)"
            name="price"
            initialValue={0}
          >
            <InputNumber 
              placeholder="0 = Miễn phí" 
              className="w-full"
              size="large"
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
          >
            <Select 
              mode="tags" 
              placeholder="Thêm tags (Enter để thêm)"
              size="large"
            />
          </Form.Item>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Yêu cầu tham gia"
            name="requirements"
          >
            <TextArea 
              rows={2} 
              placeholder="Các yêu cầu đối với người tham gia"
            />
          </Form.Item>

          <Form.Item
            label="Quyền lợi"
            name="benefits"
          >
            <TextArea 
              rows={2} 
              placeholder="Quyền lợi khi tham gia sự kiện"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default EventAdd

