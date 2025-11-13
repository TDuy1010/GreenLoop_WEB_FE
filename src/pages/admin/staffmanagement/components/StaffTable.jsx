import React from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Avatar,
  Popconfirm,
  Tooltip,
  Switch
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeOutlined
} from '@ant-design/icons'

const StaffTable = ({ 
  filteredData,
  handleView, 
  handleEdit,
  handleToggleStatus,
  handleDelete,
  pagination,
  handleTableChange
}) => {
  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={record.avatar}
            className="bg-green-100 text-green-600"
          />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.position}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-gray-400" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "department",
      key: "department",
      render: (department) => {
        // Màu sắc theo role
        const roleColors = {
          'Quản trị viên': 'red',
          'Quản lý': 'purple',
          'Quản lý cửa hàng': 'orange',
          'Nhân viên hỗ trợ': 'cyan',
          'Nhân viên': 'blue'
        };
        const color = roleColors[department] || 'blue';
        return <Tag color={color}>{department}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
      title: "Thao tác",
      key: "action",
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
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
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
      pagination={pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} nhân viên`,
      } : false}
      onChange={handleTableChange}
      scroll={{ x: 1000 }}
    />
  )
}

export default StaffTable
