import React from 'react'
import { Modal, Table, Empty, Button } from 'antd'

const DonationListModal = ({
  visible,
  loading,
  donations,
  onClose,
  onViewDetail
}) => {
  return (
    <Modal
      title="Danh sách đơn donation"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {donations.length === 0 ? (
        <Empty description="Chưa có đơn donation" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Table
          size="small"
          dataSource={donations}
          rowKey="key"
          loading={loading}
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: 'Mã donation',
              dataIndex: 'code',
              key: 'code',
              render: (text, record) => (
                <Button
                  type="link"
                  className="p-0"
                  onClick={() => onViewDetail(record.id)}
                >
                  {text}
                </Button>
              )
            },
            { title: 'Tổng sản phẩm', dataIndex: 'totalItems', key: 'totalItems' },
            {
              title: 'Tổng trọng lượng (kg)',
              dataIndex: 'totalWeight',
              key: 'totalWeight',
              render: (value) => Number(value || 0).toLocaleString('vi-VN')
            },
            {
              title: 'Tổng Eco Points',
              dataIndex: 'totalEcoPoints',
              key: 'totalEcoPoints',
              render: (value) => Number(value || 0).toLocaleString('vi-VN')
            }
          ]}
        />
      )}
    </Modal>
  )
}

export default DonationListModal

