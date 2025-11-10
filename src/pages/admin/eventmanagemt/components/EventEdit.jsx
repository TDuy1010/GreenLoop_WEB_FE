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
  Divider,
  Card,
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
import { updateEvent, updateEventThumbnail, updateEventStatus, getEventById } from '../../../../service/api/eventApi'
import VietmapInteractive from '../../../../components/VietmapInteractive'

const { TextArea } = Input
const { Option } = Select

const EventEdit = ({ visible, onClose, onUpdate, event }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState({ latitude: null, longitude: null, address: '' })
  const [loadingDetail, setLoadingDetail] = useState(false)
  const vietmapApiKey = import.meta.env.VITE_VIETMAP_API_KEY || '3aa910999593c14303117e42dc0e62171cd42a0daa6c944c'

  useEffect(() => {
    const loadEventDetail = async () => {
      if (event?.id && visible) {
        try {
          setLoadingDetail(true)
          console.log('EventEdit - Fetching event detail for id:', event.id)
          const res = await getEventById(event.id)
          const d = res?.data?.data || res?.data
          console.log('EventEdit - Event detail from API:', d)
          console.log('EventEdit - Event detail description:', d?.description)
          
          if (d) {
            // Map dữ liệu từ API detail vào form
            const lat = d.latitude != null ? Number(d.latitude) : (event?.coordinates?.lat != null ? Number(event.coordinates.lat) : null)
            const lng = d.longitude != null ? Number(d.longitude) : (event?.coordinates?.lng != null ? Number(event.coordinates.lng) : null)
            
            // Convert UTC time về GMT+7
            const convertToVietnamTime = (utcTimeString) => {
              try {
                const date = new Date(utcTimeString)
                const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
                return dayjs(vietnamTime).format('HH:mm')
              } catch {
                try { return dayjs(utcTimeString).format('HH:mm') } catch { return null }
              }
            }
            const convertToVietnamDate = (utcTimeString) => {
              try {
                const date = new Date(utcTimeString)
                const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
                return dayjs(vietnamTime)
              } catch {
                return utcTimeString ? dayjs(utcTimeString) : null
              }
            }
            
            const imageUrl = d.imageUrl || d.thumbnail || d.thumbnailUrl || d.image || d.photo || event?.image || ''
            const formValues = {
              name: d.name || event.title || event.name,
              description: d.description || '',
              status: d.status || event.status,
              date: d.startTime ? convertToVietnamDate(d.startTime) : (event.date ? dayjs(event.date) : null),
              startTime: d.startTime ? dayjs(convertToVietnamTime(d.startTime), 'HH:mm') : (event.startTime ? dayjs(event.startTime, 'HH:mm') : null),
              endTime: d.endTime ? dayjs(convertToVietnamTime(d.endTime), 'HH:mm') : (event.endTime ? dayjs(event.endTime, 'HH:mm') : null),
              location: d.locationDetail || d.location || event.location,
              note: d.note || event.note || '',
              latitude: lat,
              longitude: lng
            }
            console.log('EventEdit - Setting form values from detail:', formValues)
            form.setFieldsValue(formValues)
            setSelectedLocation({ latitude: lat, longitude: lng, address: d.locationDetail || d.location || event.location || '' })
            setImageUrl(imageUrl)
            setThumbnailFile(null)
          }
        } catch (err) {
          console.error('EventEdit - Error loading event detail:', err)
          // Fallback: dùng event object từ list nếu fetch detail thất bại
          const lat = event?.coordinates?.lat != null ? Number(event.coordinates.lat) : (event?.latitude != null ? Number(event.latitude) : null)
          const lng = event?.coordinates?.lng != null ? Number(event.coordinates.lng) : (event?.longitude != null ? Number(event.longitude) : null)
          form.setFieldsValue({
            name: event.title || event.name,
            description: event.description || '',
            status: event.status,
            date: event.date ? dayjs(event.date) : null,
            startTime: event.startTime ? dayjs(event.startTime, 'HH:mm') : null,
            endTime: event.endTime ? dayjs(event.endTime, 'HH:mm') : null,
            location: event.location,
            note: event.note || '',
            latitude: lat,
            longitude: lng
          })
          setSelectedLocation({ latitude: lat, longitude: lng, address: event.location || '' })
          setImageUrl(event.image)
          setThumbnailFile(null)
        } finally {
          setLoadingDetail(false)
        }
      } else if (event && visible) {
        // Nếu không có id, dùng event object từ list
        const lat = event?.coordinates?.lat != null ? Number(event.coordinates.lat) : (event?.latitude != null ? Number(event.latitude) : null)
        const lng = event?.coordinates?.lng != null ? Number(event.coordinates.lng) : (event?.longitude != null ? Number(event.longitude) : null)
        form.setFieldsValue({
          name: event.title || event.name,
          description: event.description || '',
          status: event.status,
          date: event.date ? dayjs(event.date) : null,
          startTime: event.startTime ? dayjs(event.startTime, 'HH:mm') : null,
          endTime: event.endTime ? dayjs(event.endTime, 'HH:mm') : null,
          location: event.location,
          note: event.note || '',
          latitude: lat,
          longitude: lng
        })
        setSelectedLocation({ latitude: lat, longitude: lng, address: event.location || '' })
        setImageUrl(event.image)
        setThumbnailFile(null)
      }
    }
    loadEventDetail()
  }, [event, visible, form])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // Chuẩn hoá thời gian gửi lên backend (UTC ISO 8601)
      const dateStr = values.date.format('YYYY-MM-DD')
      const startTimeStr = values.startTime.format('HH:mm')
      const endTimeStr = values.endTime.format('HH:mm')
      const startDateTime = dayjs(`${dateStr} ${startTimeStr}`)
      const endDateTime = dayjs(`${dateStr} ${endTimeStr}`)

      const latitude = selectedLocation.latitude != null ? Number(selectedLocation.latitude) : (
        event?.coordinates?.lat != null ? Number(event.coordinates.lat) : (event?.latitude != null ? Number(event.latitude) : null)
      )
      const longitude = selectedLocation.longitude != null ? Number(selectedLocation.longitude) : (
        event?.coordinates?.lng != null ? Number(event.coordinates.lng) : (event?.longitude != null ? Number(event.longitude) : null)
      )

      const eventData = {
        name: values.name,
        description: values.description ,
        location: values.location || event.location,
        latitude: latitude,
        longitude: longitude,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: values.status || event.status,
        note: values.note || ''
      }

      // Gọi API cập nhật (JSON)
      const res = await updateEvent(event.id, eventData)
      const ok = !!(res && (res.success === true || res.statusCode === 200 || /success/i.test(res.message || '')))
      
      // Nếu có chọn thumbnail mới thì gọi API riêng để cập nhật ảnh
      if (ok) {
        let newImageUrl = imageUrl || event.image
        // Nếu trạng thái thay đổi, gọi API riêng cập nhật status
        const statusChanged = (values.status && values.status !== event.status)
        if (statusChanged) {
          try {
            const stRes = await updateEventStatus(event.id, values.status)
            const stOk = !!(stRes && (stRes.success === true || stRes.statusCode === 200 || /success/i.test(stRes.message || '')))
            if (!stOk) {
              message.warning('Cập nhật trạng thái có thể chưa thành công, vui lòng kiểm tra lại!')
            }
          } catch (e) {
            console.warn('Update status failed:', e)
            message.warning('Không cập nhật được trạng thái, nhưng dữ liệu khác đã được lưu!')
          }
        }
        if (thumbnailFile) {
          try {
            const thumbRes = await updateEventThumbnail(event.id, thumbnailFile)
            const okThumb = !!(thumbRes && (thumbRes.success === true || thumbRes.statusCode === 200 || /success/i.test(thumbRes.message || '')))
            // Ưu tiên URL trả về từ API, nếu không có thì thêm cache-busting để thấy ảnh mới
            const apiUrl = thumbRes?.data?.url || thumbRes?.data?.thumbnailUrl || thumbRes?.url
            newImageUrl = (okThumb && apiUrl) ? apiUrl : `${newImageUrl}?t=${Date.now()}`
          } catch (err) {
            console.warn('Update thumbnail failed:', err)
            message.warning('Không cập nhật được ảnh, nhưng dữ liệu đã được lưu!')
            // Dùng cache-busting để ép trình duyệt tải lại ảnh cũ nếu backend ghi đè file cũ
            newImageUrl = `${newImageUrl}?t=${Date.now()}`
          }
        }
        // Đồng bộ lại dữ liệu bảng phía ngoài
        const updatedForTable = {
          ...event,
          title: values.name,
          description: values.description,
          date: dateStr,
          startTime: startTimeStr,
          endTime: endTimeStr,
          location: values.location,
          status: values.status || event.status,
          image: newImageUrl,
        }
        await onUpdate(updatedForTable)
      message.success('Cập nhật sự kiện thành công!')
      onClose()
      } else {
        const msg = res?.message || res?.data?.message || 'Cập nhật sự kiện thất bại!'
        message.error(msg)
      }
    } catch (error) {
      console.error('Validation failed:', error)
      message.error(error?.message || 'Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (info) => {
    const picked = info.file?.originFileObj || info.fileList?.[0]?.originFileObj || info.file
    if (picked) {
      setThumbnailFile(picked)
    }
  }

  const beforeUpload = (file) => {
    setThumbnailFile(file)
    return false
  }

  const handleLocationSelect = (lat, lng, address) => {
    setSelectedLocation({ latitude: lat, longitude: lng, address })
    form.setFieldsValue({
      latitude: Number(lat),
      longitude: Number(lng)
    })
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
      confirmLoading={loadingDetail}
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
      width={1000}
      className="event-edit-modal"
      destroyOnClose
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
        <Card title="Thông tin cơ bản" className="mb-4" size="small">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Tên sự kiện" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }, { min: 5, message: 'Tên sự kiện phải có ít nhất 5 ký tự!' }]} className="col-span-2">
              <Input placeholder="Nhập tên sự kiện" size="large" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]} className="col-span-2">
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết về sự kiện" />
            </Form.Item>
            <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
              <Select placeholder="Chọn trạng thái" size="large">
                <Option value="CREATED">Đã tạo</Option>
                <Option value="PUBLISHED">Công khai</Option>
                <Option value="UPCOMING">Sắp diễn ra</Option>
                <Option value="ONGOING">Đang diễn ra</Option>
                <Option value="CLOSED">Đã kết thúc</Option>
                <Option value="CANCELED">Đã hủy</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={2} placeholder="Ghi chú thêm (tùy chọn)" />
            </Form.Item>
          </div>
        </Card>

        <Card title="Thời gian" className="mb-4" size="small">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Ngày tổ chức" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}> 
              <DatePicker className="w-full" size="large" format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Chọn giờ bắt đầu!' }]} className="mb-0">
                <TimePicker className="w-full" size="large" format="HH:mm" placeholder="Giờ bắt đầu" />
              </Form.Item>
              <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true, message: 'Chọn giờ kết thúc!' }]} className="mb-0">
                <TimePicker className="w-full" size="large" format="HH:mm" placeholder="Giờ kết thúc" />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Card title="Địa điểm" className="mb-4" size="small">
          <Form.Item label="Tên địa điểm" name="location" rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}> 
            <Input placeholder="Tên địa điểm" size="large" />
          </Form.Item>
          <Form.Item name="latitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="longitude" hidden>
            <Input />
          </Form.Item>
          <div className="mb-2 text-sm font-medium text-gray-700">Chọn vị trí trên bản đồ (click vào map hoặc tìm kiếm địa chỉ)</div>
          {selectedLocation.latitude && selectedLocation.longitude && (
            <div className="mb-2 text-xs text-green-600">✓ Đã chọn vị trí: {Number(selectedLocation.latitude).toFixed(6)}, {Number(selectedLocation.longitude).toFixed(6)}</div>
          )}
          <VietmapInteractive
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
            height="360px"
            apiKey={vietmapApiKey}
            onLocationSelect={handleLocationSelect}
          />
        </Card>

        <Card title="Hình ảnh" className="mb-4" size="small">
          <Form.Item label="Hình ảnh sự kiện" name="image">
          <Upload
            listType="picture-card"
            maxCount={1}
            onChange={handleImageChange}
              beforeUpload={beforeUpload}
              defaultFileList={imageUrl ? [{ uid: '-1', name: 'image.png', status: 'done', url: imageUrl }] : []}
          >
            <div>
              <UploadOutlined />
              <div className="mt-2">Tải ảnh lên</div>
            </div>
          </Upload>
        </Form.Item>
        </Card>
      </Form>
    </Modal>
  )
}

export default EventEdit

