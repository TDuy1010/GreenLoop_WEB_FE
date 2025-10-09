// AdminErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { ToolOutlined, DashboardOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const AdminErrorPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Result
        icon={<ToolOutlined style={{ fontSize: 48, color: '#16a34a' }} />}
        title="Tính năng đang phát triển"
        subTitle="Chúng tôi sẽ cập nhật sớm. Vui lòng quay lại sau."
        extra={
          <div className="flex gap-3 justify-center">
            <Link to="/admin/dashboard">
              <Button type="primary" icon={<DashboardOutlined />}>
                Về Dashboard
              </Button>
            </Link>
            <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default AdminErrorPage;
