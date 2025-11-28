import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select,
  DatePicker,
  TimePicker,
  Button,
  Upload,
  message,
  Card
} from 'antd'
import { 
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { createEvent } from '../../../../service/api/eventApi'
import VietmapInteractive from '../../../../components/VietmapInteractive'
import { EVENT_STATUS_OPTIONS } from '../constants/status'

const { TextArea } = Input
const { Option } = Select

const EventAdd = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: null,
    longitude: null,
    address: ''
  })
  const vietmapApiKey = import.meta.env.VITE_VIETMAP_API_KEY || '3aa910999593c14303117e42dc0e62171cd42a0daa6c944c'

  useEffect(() => {
    if (visible) {
      form.resetFields()
      setThumbnailFile(null)
      setSelectedLocation({ latitude: null, longitude: null, address: '' })
    }
  }, [visible, form])

  const handleLocationSelect = (lat, lng, address) => {
    setSelectedLocation({ latitude: lat, longitude: lng, address })
    form.setFieldsValue({
      latitude: Number(lat),
      longitude: Number(lng)
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      // Validate form trước khi gọi API. Nếu fail, dừng tại đây
      let values
      try {
        values = await form.validateFields()
      } catch (validationError) {
        console.warn('Form validation failed:', validationError)
        message.error('Vui lòng điền đầy đủ và đúng định dạng các trường bắt buộc!')
        setLoading(false)
        return
      }
      
      // Kiểm tra tọa độ
      if (!selectedLocation.latitude || !selectedLocation.longitude) {
        message.error('Vui lòng chọn vị trí trên bản đồ!')
        setLoading(false)
        return
      }

      // Format datetime theo ISO 8601
      const dateStr = values.date.format('YYYY-MM-DD')
      const startTimeStr = values.startTime.format('HH:mm')
      const endTimeStr = values.endTime.format('HH:mm')
      
      // Tạo datetime với timezone local (Việt Nam GMT+7)
      // Nhưng khi gửi lên backend, cần convert sang UTC để backend xử lý đúng
      // Ví dụ: 6h sáng GMT+7 = 23h hôm trước UTC
      const startDateTime = dayjs(`${dateStr} ${startTimeStr}`)
      const endDateTime = dayjs(`${dateStr} ${endTimeStr}`)
      
      // Backend thường yêu cầu ISO 8601 format với UTC (có Z)
      // Format: YYYY-MM-DDTHH:mm:ss.sssZ
      const startTime = startDateTime.toISOString()
      const endTime = endDateTime.toISOString()
      
      console.log('Time input:', {
        dateStr,
        startTimeStr,
        endTimeStr,
        localTime: {
          start: startDateTime.format('YYYY-MM-DD HH:mm:ss'),
          end: endDateTime.format('YYYY-MM-DD HH:mm:ss')
        },
        utcTime: {
          start: startTime,
          end: endTime
        },
        note: 'Backend nhận UTC, hiển thị sẽ convert về GMT+7'
      })

      // Tạo event object theo API spec
      const eventData = {
        name: values.name,
        description: values.description || '',
        location: values.location || selectedLocation.address,
        latitude: Number(selectedLocation.latitude),
        longitude: Number(selectedLocation.longitude),
        startTime: startTime,
        endTime: endTime,
        status: values.status || 'CREATED',
        note: values.note || ''
      }

      console.log('Event data to send:', {
        ...eventData,
        thumbnailFile: thumbnailFile ? `${thumbnailFile.name} (${thumbnailFile.size} bytes)` : 'null'
      })

      // Gọi API tạo sự kiện
      const response = await createEvent(eventData, thumbnailFile)
      
      console.log('API Response:', response)
      
      if (response?.success) {
        message.success('Tạo sự kiện thành công!')
        form.resetFields()
        setThumbnailFile(null)
        setSelectedLocation({ latitude: null, longitude: null, address: '' })
        // Đóng modal trước
        onClose()
        // Sau đó gọi callback để reload danh sách (sau khi modal đóng)
        if (onAdd) {
          console.log('EventAdd: Calling onAdd callback to reload event list...')
          // Gọi callback sau một chút để đảm bảo modal đã đóng hoàn toàn
          setTimeout(() => {
            console.log('EventAdd: Executing onAdd callback now')
            onAdd()
          }, 500)
        } else {
          console.warn('EventAdd: onAdd callback is not provided!')
        }
      } else {
        const errorMsg = response?.message || response?.data?.message || 'Tạo sự kiện thất bại!'
        console.error('API Error Response:', response)
        message.error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText
      })
      const errorMsg = error?.response?.data?.message || 
                      error?.response?.data?.error || 
                      error?.message || 
                      'Tạo sự kiện thất bại!'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (info) => {
    // eslint-disable-next-line no-console
    console.log('Upload onChange:', {
      status: info.file.status,
      name: info.file.name,
      size: info.file.size,
      hasOrigin: !!info.file.originFileObj,
      fileListLen: info.fileList?.length
    })
    const picked = info.file?.originFileObj || info.fileList?.[0]?.originFileObj || info.file
    if (picked) {
      setThumbnailFile(picked)
      // eslint-disable-next-line no-console
      console.log('Picked thumbnail file:', { name: picked.name, size: picked.size, type: picked.type })
    } else {
      setThumbnailFile(null)
    }
  }

  const beforeUpload = (file) => {
    // Lưu ngay file người dùng chọn và chặn upload tự động
    setThumbnailFile(file)
    // eslint-disable-next-line no-console
    console.log('beforeUpload picked file:', { name: file?.name, size: file?.size, type: file?.type })
    return false
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
          Tạo sự kiện
        </Button>
      ]}
      width={1000}
      className="event-add-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{
          status: 'CREATED'
        }}
      >
        {/* Basic Information */}
        <Card title="Thông tin cơ bản" className="mb-4" size="small">
          <Form.Item
            label="Tên sự kiện"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sự kiện!' },
              { min: 5, message: 'Tên sự kiện phải có ít nhất 5 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên sự kiện" size="large" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập mô tả chi tiết về sự kiện"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="note"
          >
            <TextArea 
              rows={2} 
              placeholder="Ghi chú thêm (tùy chọn)"
              size="large"
            />
          </Form.Item>
        </Card>

        {/* Date & Time */}
        <Card title="Thời gian" className="mb-4" size="small">
          <div className="grid grid-cols-2 gap-4">
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
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái" size="large">
                {EVENT_STATUS_OPTIONS.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Giờ bắt đầu"
              name="startTime"
              rules={[{ required: true, message: 'Chọn giờ bắt đầu!' }]}
            >
              <TimePicker 
                className="w-full" 
                size="large"
                format="HH:mm"
                placeholder="Giờ bắt đầu"
              />
            </Form.Item>

            <Form.Item
              label="Giờ kết thúc"
              name="endTime"
              rules={[{ required: true, message: 'Chọn giờ kết thúc!' }]}
            >
              <TimePicker 
                className="w-full" 
                size="large"
                format="HH:mm"
                placeholder="Giờ kết thúc"
              />
            </Form.Item>
          </div>
        </Card>

        {/* Location */}
        <Card title="Địa điểm" className="mb-4" size="small">
          <Form.Item
            label="Tên địa điểm"
            name="location"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
          >
            <Input placeholder="Nhập tên địa điểm" size="large" />
          </Form.Item>

          {/* Hidden fields for latitude/longitude */}
          <Form.Item name="latitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="longitude" hidden>
            <Input />
          </Form.Item>

          {/* Map */}
          <div className="mb-4">
            <div className="mb-2 text-sm font-medium text-gray-700">
              Chọn vị trí trên bản đồ (click vào map hoặc tìm kiếm địa chỉ)
            </div>
            {selectedLocation.latitude && selectedLocation.longitude && (
              <div className="mb-2 text-xs text-green-600">
                ✓ Đã chọn vị trí: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </div>
            )}
            <VietmapInteractive
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              height="400px"
              apiKey={vietmapApiKey}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </Card>

        {/* Thumbnail */}
        <Card title="Hình ảnh" className="mb-4" size="small">
          <Form.Item
            label="Hình ảnh sự kiện (thumbnail)"
            name="thumbnail"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              onChange={handleImageChange}
              beforeUpload={beforeUpload}
            multiple={false}
            onRemove={() => { setThumbnailFile(null); return true; }}
              accept="image/*"
            >
              <div>
                <UploadOutlined />
                <div className="mt-2">Tải ảnh lên</div>
              </div>
            </Upload>
            <div className="text-xs text-gray-500 mt-2">
              Chọn file ảnh để làm thumbnail cho sự kiện (tùy chọn)
            </div>
          {thumbnailFile && (
            <div className="text-xs text-gray-600 mt-1">Đã chọn: {thumbnailFile.name} ({thumbnailFile.size} bytes)</div>
          )}
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  )
}

export default EventAdd
