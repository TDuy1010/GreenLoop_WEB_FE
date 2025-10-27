import React, { useState, useEffect } from 'react'
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
  message,
  Divider,
  Alert,
  Statistic,
  Row,
  Col
} from 'antd'
import { 
  EditOutlined,
  UploadOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const EventEdit = ({ visible, onClose, onUpdate, event }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    if (event && visible) {
      // Set form values when event data is loaded
      form.setFieldsValue({
        title: event.title,
        description: event.description,
        category: event.category,
        status: event.status,
        date: event.date ? dayjs(event.date) : null,
        startTime: event.startTime ? dayjs(event.startTime, 'HH:mm') : null,
        endTime: event.endTime ? dayjs(event.endTime, 'HH:mm') : null,
        location: event.location,
        address: event.address,
        organizer: event.organizer,
        maxParticipants: event.maxParticipants,
        price: event.price,
        tags: event.tags,
        requirements: event.requirements,
        benefits: event.benefits
      })
      setImageUrl(event.image)
    }
  }, [event, visible, form])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // Format dates and times
      const formattedValues = {
        ...event,
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm'),
        image: imageUrl || event.image
      }

      await onUpdate(formattedValues)
      message.success('Cập nhật sự kiện thành công!')
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
      setImageUrl(info.file.response?.url || event.image)
      message.success('Tải ảnh lên thành công!')
    } else if (info.file.status === 'error') {
      message.error('Tải ảnh lên thất bại!')
    }
  }

  if (!event) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <EditOutlined className="text-blue-600" />
          <span>Chỉnh sửa sự kiện</span>
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
          className="bg-blue-600 hover:bg-blue-700"
        >
          Cập nhật
        </Button>
      ]}
      width={800}
      className="event-edit-modal"
    >
      {/* Event Info Banner */}
      <Alert
        message={
          <div className="flex items-center justify-between">
            <div>
              <strong>Mã sự kiện:</strong> EV-{String(event.id).padStart(4, '0')}
            </div>
            <div>
              <strong>Ngày tạo:</strong> {new Date(event.date).toLocaleDateString('vi-VN')}
            </div>
          </div>
        }
        type="info"
        showIcon
        icon={<CalendarOutlined />}
        className="mb-4"
      />

      {/* Statistics Banner */}
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Statistic 
            title="Đã đăng ký" 
            value={event.registeredCount || 0}
            suffix={`/ ${event.maxParticipants}`}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={12}>
          <Statistic 
            title="Tỷ lệ lấp đầy" 
            value={Math.round((event.registeredCount / event.maxParticipants) * 100)}
            suffix="%"
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
      </Row>

      <Divider />

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
            defaultFileList={imageUrl ? [{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: imageUrl,
            }] : []}
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
              <Option value="full">Đã đầy</Option>
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

export default EventEdit

