import React from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Avatar,
  Popconfirm
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons'

const StaffTable = ({ 
  filteredData, 
  handleEdit, 
  handleDelete 
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
      render: (department) => <Tag color="blue">{department}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Đang làm việc" : "Nghỉ việc"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
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
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} nhân viên`,
      }}
      scroll={{ x: 1000 }}
    />
  )
}

export default StaffTable
