import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const EcoRuleFilters = ({
  filters,
  onFiltersChange,
  actionTypeOptions,
  categoryOptions,
}) => {
  const handleChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value ?? '',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <div className="text-sm text-gray-600 mb-1">Loại hành động</div>
        <Select
          value={filters.actionType}
          onChange={(value) => handleChange('actionType', value)}
          style={{ width: '100%' }}
          suffixIcon={<FilterOutlined />}
        >
          <Option value="all">Tất cả</Option>
          {actionTypeOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-1">Mã quy tắc</div>
        <Input
          placeholder="Nhập mã..."
          allowClear
          value={filters.code}
          onChange={(e) => handleChange('code', e.target.value)}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-1">Tên quy tắc</div>
        <Input
          placeholder="Nhập tên..."
          allowClear
          value={filters.name}
          onChange={(e) => handleChange('name', e.target.value)}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-1">Danh mục</div>
        <Select
          placeholder="Chọn danh mục"
          style={{ width: '100%' }}
          allowClear
          value={filters.categoryId}
          onChange={(value) => handleChange('categoryId', value)}
          options={categoryOptions.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
      </div>
    </div>
  );
};

export default React.memo(EcoRuleFilters);

