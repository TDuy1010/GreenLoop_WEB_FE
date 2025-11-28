import React from 'react';
import { Card, Table, Avatar, Tag, Button, Space, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, CloudUploadOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const BlogTable = ({
  data,
  loading,
  pagination,
  onChange,
  onView,
  onEdit,
  onPublish,
  onHide,
  onDelete,
  publishLoadingId,
  hideLoadingId,
  deleteLoadingId,
  getStatusMeta
}) => {
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar shape="square" size={48} src={record.thumbnailUrl}>
            {text?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <div>
            <div className="font-medium">{text || '—'}</div>
            <div className="text-xs text-gray-500">ID: {record.id}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Tác giả',
      dataIndex: 'authorName',
      key: 'authorName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text || 'Không rõ'}</div>
          <div className="text-xs text-gray-500">{record.authorEmail || '—'}</div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusMeta(status).color}>
          {getStatusMeta(status).label}
        </Tag>
      )
    },
    {
      title: 'Xuất bản',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      sorter: true,
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—')
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_text, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => onView(record)}>
            Xem
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-blue-500 hover:text-blue-600"
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          {['Bản nháp', 'Đã ẩn'].includes(record.status) && (
            <Popconfirm
              title="Công khai bài viết?"
              description="Bài sẽ hiển thị cho khách hàng sau khi công khai."
              onConfirm={() => onPublish(record)}
              okText="Công khai"
              cancelText="Hủy"
            >
              <Button
                type="text"
                className="text-green-600 hover:text-green-700"
                icon={<CloudUploadOutlined />}
                loading={publishLoadingId === record.id}
              >
                Công khai
              </Button>
            </Popconfirm>
          )}
          {record.status === 'Đã công khai' && (
            <Popconfirm
              title="Ẩn bài viết?"
              description="Bài sẽ bị ẩn khỏi khách hàng nhưng vẫn giữ trong hệ thống."
              onConfirm={() => onHide(record)}
              okText="Ẩn"
              cancelText="Hủy"
            >
              <Button
                type="text"
                className="text-red-500 hover:text-red-600"
                icon={<StopOutlined />}
                loading={hideLoadingId === record.id}
              >
                Ẩn
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Xóa bài viết?"
            description="Bài viết sẽ bị xóa vĩnh viễn."
            onConfirm={() => onDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              className="text-gray-500 hover:text-red-600"
              icon={<DeleteOutlined />}
              loading={deleteLoadingId === record.id}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card className="shadow-sm">
      <Table
        rowKey={(record) => record.id ?? record.title}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `${total} bài viết`
        }}
        onChange={onChange}
        locale={{
          emptyText: 'Chưa có bài viết nào'
        }}
        scroll={{ x: 768 }}
      />
    </Card>
  );
};

export default BlogTable;

