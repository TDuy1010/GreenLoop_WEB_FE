import React from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Image,
  Popconfirm
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  UserAddOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const EventTable = ({ 
  filteredData, 
  handleView, 
  handleEdit, 
  handleDelete,
  handleAssign,
  statusConfig,
  categoryConfig 
}) => {
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
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
            className="text-blue-600 hover:text-blue-700"
            size="small"
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={<UserAddOutlined />}
            onClick={() => handleAssign(record)}
            className="text-purple-600 hover:text-purple-700"
            size="small"
          >
            Thêm nhân viên
          </Button>
          <Popconfirm
            title="Xóa sự kiện"
            description="Bạn có chắc chắn muốn xóa sự kiện này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
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
