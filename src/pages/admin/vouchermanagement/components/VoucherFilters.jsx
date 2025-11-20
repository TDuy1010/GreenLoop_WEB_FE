import React from 'react';
import { Input, DatePicker } from 'antd';
const { Search } = Input;
const { RangePicker } = DatePicker;

const VoucherFilters = ({
  filters,
  onChange,
  placeholder = 'Tìm kiếm chiến dịch...',
}) => {
  const handleNameChange = (value) => {
    onChange({
      ...filters,
      name: value || '',
    });
  };

  const handleDateRangeChange = (dates) => {
    onChange({
      ...filters,
      dateRange: dates?.length === 2 ? dates : [null, null],
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
      <Search
        placeholder={placeholder}
        allowClear
        size="large"
        defaultValue={filters.name}
        onSearch={(value) => handleNameChange(value?.trim())}
        onChange={(event) => {
          if (!event.target.value) {
            handleNameChange('');
          }
        }}
        style={{ maxWidth: '480px' }}
      />
      <RangePicker
        size="large"
        className="w-full md:w-auto"
        value={filters.dateRange}
        onChange={handleDateRangeChange}
        format="DD/MM/YYYY"
      />
    </div>
  );
};

export default React.memo(VoucherFilters);


