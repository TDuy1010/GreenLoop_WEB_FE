import React from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Avatar,
  Tooltip,
  Badge,
  Switch
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'

const UserTable = ({ 
  filteredData, 
  handleView, 
  handleToggleStatus,
  accountTypeConfig,
  genderConfig,
  pagination,
  handleTableChange
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
    // {
    //   title: 'Loại tài khoản',
    //   dataIndex: 'accountType',
    //   key: 'accountType',
    //   render: (accountType) => {
    //     const config = accountTypeConfig[accountType] || { color: 'default', text: accountType }
    //     return <Tag color={config.color}>{config.text}</Tag>
    //   },
    // },
    // {
    //   title: 'Hoạt động',
    //   key: 'activity',
    //   render: (_, record) => (
    //     <div className="space-y-1 text-center">
    //       <div className="flex items-center justify-center gap-1 text-sm">
    //         <ShoppingCartOutlined className="text-blue-500" />
    //         <span className="font-medium">{record.totalOrders}</span>
    //         <span className="text-xs text-gray-500">đơn</span>
    //       </div>
    //       <div className="flex items-center justify-center gap-1 text-sm">
    //         <HeartOutlined className="text-red-500" />
    //         <span className="font-medium">{record.donationCount}</span>
    //         <span className="text-xs text-gray-500">quyên góp</span>
    //       </div>
    //       <div className="flex items-center justify-center gap-1 text-sm">
    //         <CalendarOutlined className="text-green-500" />
    //         <span className="font-medium">{record.eventParticipation}</span>
    //         <span className="text-xs text-gray-500">sự kiện</span>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={status === 'active'}
            onChange={() => handleToggleStatus(record)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            className={status === 'active' ? 'bg-green-600' : ''}
          />
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
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} khách hàng`,
      } : false}
      onChange={handleTableChange}
      scroll={{ x: 1200 }}
    />
  )
}

export default UserTable
