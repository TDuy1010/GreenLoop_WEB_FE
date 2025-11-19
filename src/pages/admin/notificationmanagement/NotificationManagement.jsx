import React from 'react';
import { Card, Typography, Empty, Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const NotificationManagement = () => {
  const handleCreate = () => {};
  const handleRefresh = () => {};

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} className="m-0">
              Quản lý thông báo
            </Title>
            <Paragraph className="text-gray-500 mb-0">
              Gửi và theo dõi các thông báo gửi đến người dùng.
            </Paragraph>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Tạo thông báo
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="shadow-sm">
        <Empty description="Chức năng thông báo đang được phát triển." />
      </Card>
    </div>
  );
};

export default NotificationManagement;


