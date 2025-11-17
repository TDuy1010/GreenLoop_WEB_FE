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
  EyeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

const ProductTable = ({
  filteredData,
  handleView,
  handleEdit,
  handleApprove,
  handleDelete,
  conditionConfig
}) => {
  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 300,
      render: (_, record) => (
        <div className="flex gap-3">
          <Image
            width={60}
            height={60}
            src={record.images && record.images.length > 0 ? record.images[0] : 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'}
            alt={record.name}
            className="rounded-lg object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{record.name}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{record.description}</div>
            {record.code && (
              <div className="text-xs text-gray-400 mt-1">Mã: {record.code}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin sản phẩm',
      key: 'info',
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 w-20">Danh mục:</span>
            <span className="text-sm text-gray-900">{record.category}</span>
          </div>
          {record.type && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 w-20">Loại:</span>
              <Tag color={record.type === 'DONATION' ? 'green' : 'blue'}>
                {record.type === 'DONATION' ? 'Quyên góp' : 'Mua'}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition) => {
        const config = conditionConfig[condition] || { color: 'default', text: condition }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price = 0) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            {price.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
      ),
    },
    {
      title: 'Eco Points',
      dataIndex: 'ecoPoints',
      key: 'ecoPoints',
      render: (points = 0) => (
        <div className="text-center">
          <Tag color="orange">{points}</Tag>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small" direction="vertical">
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
          </Space>
          <Space size="small">
            {record.status === 'pending' && (
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
                className="text-green-600 hover:text-green-700"
                size="small"
              >
                Duyệt
              </Button>
            )}
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
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
          `${range[0]}-${range[1]} của ${total} sản phẩm`,
      }}
      scroll={{ x: 1200 }}
    />
  )
}

export default ProductTable
