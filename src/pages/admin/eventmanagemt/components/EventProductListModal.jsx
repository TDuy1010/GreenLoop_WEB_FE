import React, { useMemo } from 'react'
import { Modal, Table, Tag, Popconfirm, Button } from 'antd'

const EventProductListModal = ({
  open,
  loading,
  products = [],
  onClose,
  onRemoveProduct,
  removingProductId,
  selectedRowKeys = [],
  onSelectionChange,
  onBulkRemove,
  bulkRemoving
}) => {
  const columns = useMemo(() => [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-xs text-gray-500">Mã: {record.code}</div>
        </div>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (value) => (
        <Tag color={value === 'CHARITY' ? 'green' : 'blue'}>
          {value === 'CHARITY' ? 'Quyên góp' : 'Mua bán'}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'AVAILABLE' ? 'green' : 'orange'
        return <Tag color={color}>{status || 'N/A'}</Tag>
      }
    },
    {
      title: 'Eco Points',
      dataIndex: 'ecoPoints',
      key: 'ecoPoints',
      align: 'right',
      render: (value) => value ?? 0
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Popconfirm
          title="Bỏ sản phẩm khỏi sự kiện?"
          okText="Đồng ý"
          cancelText="Huỷ"
          placement="left"
          onConfirm={() => onRemoveProduct?.(record)}
        >
          <Button
            size="small"
            danger
            loading={removingProductId === (record.eventMappingId || record.id)}
            disabled={!onRemoveProduct}
          >
            Bỏ khỏi sự kiện
          </Button>
        </Popconfirm>
      )
    }
  ], [onRemoveProduct, removingProductId])

  const rowSelection = onSelectionChange
    ? {
        selectedRowKeys,
        onChange: (keys) => onSelectionChange(keys)
      }
    : undefined

  return (
    <Modal
      title="Sản phẩm trong sự kiện"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      {onBulkRemove && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            Đã chọn {selectedRowKeys.length} sản phẩm
          </div>
          <Button
            danger
            type="primary"
            disabled={!selectedRowKeys.length}
            loading={bulkRemoving}
            onClick={onBulkRemove}
          >
            Bỏ khỏi sự kiện
          </Button>
        </div>
      )}
      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        rowSelection={rowSelection}
        rowKey={(record) => record.eventMappingId || record.id || record.key}
        pagination={{ pageSize: 6 }}
      />
    </Modal>
  )
}

export default EventProductListModal

