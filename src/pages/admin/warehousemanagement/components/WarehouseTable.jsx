import React from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Progress,
  Popconfirm,
  Tooltip
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  HomeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  PoweroffOutlined
} from '@ant-design/icons'

const WarehouseTable = ({ 
  filteredData, 
  handleView, 
  handleEdit, 
  handleToggleStatus,
  handleDelete,
  statusConfig,
  typeConfig 
}) => {
  const columns = [
    {
      title: 'Thông tin kho',
      key: 'warehouse',
      width: 280,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HomeOutlined className="text-blue-500" />
            <span className="font-medium text-gray-900">{record.name}</span>
          </div>
          <div className="text-sm text-gray-500">{record.address}</div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Thành lập: {new Date(record.establishedDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Quản lý',
      key: 'manager',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <UserOutlined className="text-gray-400" />
            <span className="font-medium">{record.manager}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-gray-400" />
            <span className="truncate">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại kho',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = typeConfig[type] || { color: 'default', text: type }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: 'Sức chứa & Tồn kho',
      key: 'capacity',
      render: (_, record) => (
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">{record.currentStock}</span>
            <span className="text-gray-400"> / {record.capacity}</span>
          </div>
          <Progress 
            percent={Math.round((record.currentStock / record.capacity) * 100)}
            size="small"
            status={record.currentStock / record.capacity > 0.9 ? 'exception' : 'active'}
          />
          <div className="text-xs text-gray-500">
            {record.totalProducts} sản phẩm
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      key: 'categories',
      render: (_, record) => (
        <div className="space-y-1">
          {record.categories.slice(0, 2).map(category => (
            <Tag key={category} size="small" color="blue">{category}</Tag>
          ))}
          {record.categories.length > 2 && (
            <Tag size="small" color="default">+{record.categories.length - 2}</Tag>
          )}
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
    {
      title: 'Giờ hoạt động',
      key: 'operatingHours',
      render: (_, record) => (
        <div className="flex items-center gap-2 text-sm">
          <ClockCircleOutlined className="text-gray-400" />
          <span>{record.operatingHours}</span>
        </div>
      ),
    },
    {
      title: 'Cập nhật cuối',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (date) => (
        <div className="text-sm">
          {new Date(date).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
                className="text-green-600 hover:text-green-700"
                size="small"
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                className="text-blue-600 hover:text-blue-700"
                size="small"
              />
            </Tooltip>
          </Space>
          <Space size="small">
            <Tooltip title={record.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}>
              <Button
                type="text"
                icon={<PoweroffOutlined />}
                onClick={() => handleToggleStatus(record)}
                className={record.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                size="small"
              />
            </Tooltip>
            <Popconfirm
              title="Xóa kho"
              description="Bạn có chắc chắn muốn xóa kho này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          </Space>
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
          `${range[0]}-${range[1]} của ${total} kho`,
      }}
      scroll={{ x: 1400 }}
    />
  )
}

export default WarehouseTable
