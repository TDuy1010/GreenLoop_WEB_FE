import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Image,
  Switch,
  message
} from 'antd'
import { 
  EditOutlined, 
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { activateEvent } from '../../../../service/api/eventApi'
import dayjs from 'dayjs'

const EventTable = ({ 
  filteredData, 
  handleView, 
  handleEdit, 
  handleDelete,
  handleAssign,
  statusConfig,
  categoryConfig,
  onActivated,
  isStaffOnly = false
}) => {
  // Loading per-row khi toggle để mượt mà và tránh spam request
  const [rowLoading, setRowLoading] = useState({})
  // Trạng thái tạm thời để UI phản hồi ngay (optimistic update)
  const [tempActive, setTempActive] = useState({})
  const columns = [
    {
      title: 'Sự kiện',
      key: 'event',
      width: 300,
      render: (_, record) => (
        <div className="flex gap-3">
          <Image
            width={60}
            height={60}
            src={record.image}
            alt={record.title}
            className="rounded-lg object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{record.title}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{record.description}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {record.tags.slice(0, 2).map(tag => (
                <Tag key={tag} size="small" color="blue">{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian & Địa điểm',
      key: 'datetime',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <CalendarOutlined className="text-gray-400" />
            <span>{dayjs(record.date).format('DD/MM/YYYY')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ClockCircleOutlined className="text-gray-400" />
            <span>{record.startTime} - {record.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <EnvironmentOutlined className="text-gray-400" />
            <span className="truncate">{record.location}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (_, record) => {
        const active = record?.isActive === true || record?.active === true
        const checked = tempActive[record.id] !== undefined ? tempActive[record.id] : active
        return (
          <Switch
            checked={checked}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
            size="default"
            loading={rowLoading[record.id] === true}
            onChange={async (val) => {
              // Optimistic update
              setTempActive(prev => ({ ...prev, [record.id]: val }))
              setRowLoading(prev => ({ ...prev, [record.id]: true }))
              try {
                await activateEvent(record.id)
                // Nếu parent muốn sync lại dữ liệu, gọi refresh sau nhỏ
                if (typeof onActivated === 'function') onActivated()
              } catch (e) {
                // Revert nếu lỗi
                setTempActive(prev => ({ ...prev, [record.id]: !val }))
                message.error('Cập nhật trạng thái thất bại')
              } finally {
                setRowLoading(prev => ({ ...prev, [record.id]: false }))
              }
            }}
          />
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: 'Số người tham gia',
      key: 'totalParticipants',
      width: 150,
      align: 'center',
      render: (_, record) => {
        const count = typeof record.totalParticipants === 'number' ? record.totalParticipants : (Number(record.totalParticipants) || 0)
        return (
          <div className="flex items-center justify-center gap-2">
            <UserOutlined className="text-blue-500" />
            <span className="font-medium">{count}</span>
          </div>
        )
      },
    },
    {
      title: 'Số nhân viên',
      key: 'totalStaffs',
      width: 130,
      align: 'center',
      render: (_, record) => {
        const count = typeof record.totalStaffs === 'number' ? record.totalStaffs : (Number(record.totalStaffs) || 0)
        return (
          <div className="flex items-center justify-center gap-2">
            <TeamOutlined className="text-purple-500" />
            <span className="font-medium">{count}</span>
          </div>
        )
      },
    },
    // Bỏ cột Phí tham gia theo yêu cầu
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            className="text-green-600 hover:text-green-700"
            size="small"
          >
            Xem
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={isStaffOnly}
            className="text-blue-600 hover:text-blue-700"
            size="small"
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={<UserAddOutlined />}
            onClick={() => handleAssign(record)}
            disabled={isStaffOnly}
            className="text-purple-600 hover:text-purple-700"
            size="small"
          >
            {record.staffCount > 0 ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{
        pageSize: 8,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} sự kiện`,
      }}
      scroll={{ x: 1200 }}
    />
  )
}

export default EventTable
