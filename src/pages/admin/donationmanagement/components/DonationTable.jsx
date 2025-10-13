import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Typography } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const DonationTable = ({ data, loading }) => {
  
  const getStatusColor = (status) => {
    const colors = {
      received: 'success',
      pending: 'warning', 
      processing: 'processing',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      received: 'Đã tiếp nhận',
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý', 
      rejected: 'Từ chối'
    };
    return texts[status] || status;
  };

  const getConditionColor = (condition) => {
    if (condition.includes('95%') || condition.includes('90%')) return 'green';
    if (condition.includes('85%') || condition.includes('80%')) return 'blue';
    if (condition.includes('75%') || condition.includes('70%')) return 'orange';
    return 'default';
  };

  const formatClothingItems = (clothingItems) => {
    if (!clothingItems || clothingItems.length === 0) return '-';
    
    return (
      <div className="space-y-2">
        {clothingItems.map((item, index) => (
          <div key={index} className="text-xs border-l-2 border-gray-200 pl-2">
            <div className="font-medium text-gray-900">{item.type}</div>
            <div className="text-gray-600">
              <span className="inline-block mr-2">SL: {item.quantity}</span>
              <span className="inline-block mr-2">Size: {item.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag color={getConditionColor(item.condition)} size="small">
                {item.condition}
              </Tag>
              <span className="text-gray-500">{item.color}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleView = (record) => {
    console.log('View donation:', record);
  };

  const handleEdit = (record) => {
    console.log('Edit donation:', record);
  };

  const handleDelete = (record) => {
    console.log('Delete donation:', record);
  };

  const handleApprove = (record) => {
    console.log('Approve donation:', record);
  };

  const handleReject = (record) => {
    console.log('Reject donation:', record);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Người quyên góp',
      key: 'donor',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.donorName}</div>
          <div className="text-sm text-gray-500">{record.donorEmail}</div>
          <div className="text-xs text-gray-400">{record.donorPhone}</div>
        </div>
      ),
    },
    {
      title: 'Quần áo quyên góp',
      dataIndex: 'clothingItems',
      key: 'clothingItems',
      width: 300,
      render: (clothingItems) => formatClothingItems(clothingItems),
    },
    {
      title: 'Khối lượng',
      dataIndex: 'totalWeight',
      key: 'totalWeight',
      width: 100,
      render: (weight) => (
        <Text strong className="text-blue-600">
          {weight} kg
        </Text>
      ),
      sorter: (a, b) => (a.totalWeight || 0) - (b.totalWeight || 0),
    },
    {
      title: 'Sự kiện',
      dataIndex: 'eventName',
      key: 'eventName',
      width: 200,
      render: (eventName) => (
        <Tooltip title={eventName}>
          <Text className="text-blue-600 cursor-pointer hover:underline">
            {eventName.length > 35 ? `${eventName.substring(0, 35)}...` : eventName}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Người tiếp nhận',
      dataIndex: 'receivedBy',
      key: 'receivedBy',
      width: 140,
      render: (receivedBy) => (
        receivedBy ? (
          <Text className="text-green-600">{receivedBy}</Text>
        ) : (
          <Text type="secondary">Chưa có</Text>
        )
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Đã tiếp nhận', value: 'received' },
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đang xử lý', value: 'processing' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thời gian',
      dataIndex: 'donatedAt',
      key: 'donatedAt',
      width: 140,
      render: (donatedAt) => (
        <div>
          <div className="text-sm">{dayjs(donatedAt).format('DD/MM/YYYY')}</div>
          <div className="text-xs text-gray-500">{dayjs(donatedAt).format('HH:mm')}</div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.donatedAt).unix() - dayjs(b.donatedAt).unix(),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      render: (note) => (
        note ? (
          <Tooltip title={note}>
            <Text className="text-gray-600">
              {note.length > 50 ? `${note.substring(0, 50)}...` : note}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          
          {record.status === 'pending' && (
            <>
              <Tooltip title="Phê duyệt">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined />} 
                  size="small"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  size="small"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleReject(record)}
                />
              </Tooltip>
            </>
          )}
          
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small"
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1800, y: 600 }}
      pagination={{
        total: data?.length || 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} của ${total} lượt quyên góp`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      size="small"
      className="donation-table"
    />
  );
};

export default DonationTable;
