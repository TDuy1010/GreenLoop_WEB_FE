import React from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Avatar,
  Popconfirm,
  Tooltip,
  Badge
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'

const UserTable = ({ 
  filteredData, 
  handleView, 
  handleEdit, 
  handleToggleStatus,
  handleDelete,
  statusConfig,
  accountTypeConfig,
  genderConfig 
}) => {
  const columns = [
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Badge 
            dot={record.status === 'active'} 
            status={record.status === 'active' ? 'success' : 'default'}
          >
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              src={record.avatar}
              className="bg-green-100 text-green-600"
            />
          </Badge>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{record.name}</span>
              {record.isVerified && (
                <Tooltip title="Đã xác thực">
                  <Tag color="green" size="small">✓</Tag>
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-gray-500">{genderConfig[record.gender]}</div>
            <div className="text-xs text-gray-400">
              ID: {record.id} • Tham gia: {new Date(record.joinDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-gray-400" />
            <span className="truncate">{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <EnvironmentOutlined className="text-gray-400" />
            <span className="truncate text-xs">{record.address}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (accountType) => {
        const config = accountTypeConfig[accountType] || { color: 'default', text: accountType }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: 'Hoạt động',
      key: 'activity',
      render: (_, record) => (
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1 text-sm">
            <ShoppingCartOutlined className="text-blue-500" />
            <span className="font-medium">{record.totalOrders}</span>
            <span className="text-xs text-gray-500">đơn</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <HeartOutlined className="text-red-500" />
            <span className="font-medium">{record.donationCount}</span>
            <span className="text-xs text-gray-500">quyên góp</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <CalendarOutlined className="text-green-500" />
            <span className="font-medium">{record.eventParticipation}</span>
            <span className="text-xs text-gray-500">sự kiện</span>
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
    {
      title: 'Lần cuối truy cập',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
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
          <Tooltip title={record.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
            <Button
              type="text"
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record)}
              className={record.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa khách hàng"
            description="Bạn có chắc chắn muốn xóa khách hàng này?"
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
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} khách hàng`,
      }}
      scroll={{ x: 1400 }}
    />
  )
}

export default UserTable
