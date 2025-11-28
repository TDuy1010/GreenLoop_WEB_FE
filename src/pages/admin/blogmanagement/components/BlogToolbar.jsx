import React from 'react';
import { Card, Typography, Button, Space, Input, Select } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const BlogToolbar = ({
  searchInput,
  onSearchInputChange,
  onSearch,
  statusFilter,
  onStatusChange,
  onRefresh,
  onCreate,
  statusOptions
}) => (
  <Card className="shadow-sm">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={3} className="m-0">
            Quản lý Blog
          </Title>
          <Paragraph className="text-gray-500 mb-0">
            Tạo, chỉnh sửa và xuất bản các bài viết truyền thông.
          </Paragraph>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Tải lại
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Thêm bài viết
          </Button>
        </Space>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Search
          placeholder="Tìm kiếm theo tiêu đề hoặc nội dung"
          allowClear
          enterButton={<SearchOutlined />}
          value={searchInput}
          onChange={onSearchInputChange}
          onSearch={onSearch}
          className="md:max-w-md"
        />
        <Space>
          <span className="text-sm text-gray-600">Trạng thái</span>
          <Select
            value={statusFilter}
            onChange={onStatusChange}
            className="min-w-[160px]"
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Space>
      </div>
    </div>
  </Card>
);

export default BlogToolbar;

