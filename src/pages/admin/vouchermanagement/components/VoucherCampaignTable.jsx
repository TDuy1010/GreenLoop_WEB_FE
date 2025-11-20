import React from 'react';
import { Card, Empty, Table, Tag, Button, Tooltip, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import VoucherFilters from './VoucherFilters';
import { formatDateVN } from '../../../../utils/dateUtils';

const VoucherCampaignTable = ({
  data,
  loading,
  filters,
  onFiltersChange,
  onEdit,
  onViewVouchers,
  pagination,
  onChangePage,
}) => {
  const columns = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'campaignName',
      key: 'campaignName',
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{record.campaignDescription || '—'}</div>
        </div>
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 180,
      render: (value) => formatDateVN(value, 'DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 180,
      render: (value) => formatDateVN(value, 'DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem voucher">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="text-green-600 hover:text-green-700"
              onClick={() => onViewVouchers(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <VoucherFilters
        filters={filters}
        onChange={onFiltersChange}
        placeholder="Tìm kiếm chiến dịch..."
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="campaignId"
        loading={loading}
        locale={{
          emptyText: <Empty description="Chưa có chiến dịch nào." />,
        }}
        pagination={{
          current: pagination?.current || 1,
          pageSize: pagination?.pageSize || 10,
          total: pagination?.total || data.length,
          showSizeChanger: true,
          showTotal: (total) => `${total} chiến dịch`,
          onChange: onChangePage ? (page, pageSize) => onChangePage(page, pageSize) : undefined,
        }}
      />
    </div>
  );
};

export default React.memo(VoucherCampaignTable);


