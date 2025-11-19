import React from 'react';
import { Card, Typography, Empty, Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const EcoPointRuleManagement = () => {
  const handleCreate = () => {
    // TODO: Integrate create eco point rule modal
  };

  const handleRefresh = () => {
    // TODO: Integrate fetch logic
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} className="m-0">
              Quản lý Eco Point Rule
            </Title>
            <Paragraph className="text-gray-500 mb-0">
              Cấu hình quy tắc tích và sử dụng điểm Eco cho hệ thống.
            </Paragraph>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Thêm quy tắc
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="shadow-sm">
        <Empty description="Chức năng đang được xây dựng. Vui lòng quay lại sau!" />
      </Card>
    </div>
  );
};

export default EcoPointRuleManagement;


