import React from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Image,
  Popconfirm,
  Tooltip
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
            src={record.images[0]}
            alt={record.name}
            className="rounded-lg object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{record.name}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{record.description}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {record.tags.slice(0, 2).map(tag => (
                <Tag key={tag} size="small" color="blue">{tag}</Tag>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span>👁 {record.views}</span>
              <span>❤️ {record.likes}</span>
              <span>⭐ {record.ecoPoints} EP</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin sản phẩm',
      key: 'info',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium">Danh mục:</span> {record.category}
          </div>
          <div className="text-sm">
            <span className="font-medium">Thương hiệu:</span> {record.brand}
          </div>
          <div className="text-sm">
            <span className="font-medium">Size:</span> {record.size} | 
            <span className="font-medium"> Màu:</span> {record.color}
          </div>
          <div className="text-sm">
            <span className="font-medium">Chất liệu:</span> {record.material}
          </div>
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
      title: 'Người quyên góp',
      key: 'donor',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">{record.donorName}</div>
          <div className="text-xs text-gray-500">{record.donorEmail}</div>
          <div className="text-xs text-gray-500">{record.donorPhone}</div>
          <div className="text-xs text-gray-400">
            {new Date(record.donationDate).toLocaleDateString('vi-VN')}
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            {price.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
      ),
    },
    {
      title: 'Kho',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <Tag color="purple">{location}</Tag>
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
            {!record.isApproved && (
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
      scroll={{ x: 1600 }}
    />
  )
}

export default ProductTable
