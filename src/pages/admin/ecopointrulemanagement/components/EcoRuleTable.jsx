import React, { useMemo } from 'react';
import { Table, Tag, Switch, Button } from 'antd';

const EcoRuleTable = ({
  rules,
  loading,
  categoryOptions,
  onToggleStatus,
  onEdit,
}) => {
  const columns = useMemo(
    () => [
      {
        title: 'Mã quy tắc',
        dataIndex: 'code',
        key: 'code',
        width: 140,
        render: (code) => <strong className="text-blue-600">{code}</strong>,
      },
      {
        title: 'Tên quy tắc',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => (
          <div>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{record.description || '—'}</div>
          </div>
        ),
      },
      {
        title: 'Hành động',
        dataIndex: 'actionType',
        key: 'actionType',
        width: 160,
        render: (value) => (
          <Tag color="geekblue">{value || 'Không xác định'}</Tag>
        ),
      },
      {
        title: 'Danh mục',
        dataIndex: 'categoryId',
        key: 'categoryId',
        width: 140,
        render: (value) => {
          if (!value) return '—';
          const category = categoryOptions.find((item) => item.id === value);
          return category ? category.name : '—';
        },
      },
      {
        title: 'Khoảng điểm',
        key: 'pointsRange',
        width: 180,
        render: (_, record) => (
          <span className="font-medium text-gray-800">
            {record.minPoints ?? 0} - {record.maxPoints ?? 0}
          </span>
        ),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'isActive',
        key: 'isActive',
        width: 140,
        render: (isActive, record) => (
          <Switch
            checked={isActive}
            onChange={() => onToggleStatus(record)}
          />
        ),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <Button type="link" onClick={() => onEdit(record)}>
            Chỉnh sửa
          </Button>
        ),
      },
    ],
    [categoryOptions, onToggleStatus, onEdit]
  );

  return (
    <Table
      columns={columns}
      dataSource={rules}
      rowKey="id"
      loading={loading}
      locale={{
        emptyText: (
          <span>Chưa có quy tắc nào khớp với điều kiện. Thử thay đổi bộ lọc nhé!</span>
        ),
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total) => `${total} quy tắc`,
      }}
    />
  );
};

export default React.memo(EcoRuleTable);

