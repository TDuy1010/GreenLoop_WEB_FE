import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Input, Select, Button, message, Space } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import DonationTable from './components/DonationTable';
import DonationDetail from './components/DonationDetail';
import DonationAdd from './components/DonationAdd';
import DonationEdit from './components/DonationEdit';

const { Search } = Input;
const { Option } = Select;

const DonationManagement = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data cho donations (quyên góp quần áo)
  const mockDonations = [
    {
      id: 1,
      donorName: 'Nguyễn Văn A',
      donorEmail: 'nguyenvana@email.com',
      donorPhone: '0123456789',
      clothingItems: [
        { type: 'Áo thun', condition: 'Mới 90%', quantity: 5, size: 'M, L', color: 'Trắng, Xanh' },
        { type: 'Quần jean', condition: 'Mới 80%', quantity: 2, size: 'L', color: 'Xanh đen' }
      ],
      eventId: 1,
      eventName: 'Thu gom quần áo cũ - Bãi biển Vũng Tàu',
      status: 'received',
      donatedAt: '2024-01-15 10:30:00',
      receivedBy: 'Trần Thị C',
      note: 'Quần áo còn rất tốt, đã giặt sạch',
      totalWeight: 2.5
    },
    {
      id: 2,
      donorName: 'Trần Thị B',
      donorEmail: 'tranthib@email.com',
      donorPhone: '0987654321',
      clothingItems: [
        { type: 'Áo khoác', condition: 'Mới 95%', quantity: 3, size: 'S, M', color: 'Đen, Xám' },
        { type: 'Váy', condition: 'Mới 85%', quantity: 4, size: 'S, M, L', color: 'Hồng, Trắng' },
        { type: 'Áo sơ mi', condition: 'Mới 90%', quantity: 6, size: 'M, L, XL', color: 'Trắng, Xanh' }
      ],
      eventId: 1,
      eventName: 'Thu gom quần áo cũ - Bãi biển Vũng Tàu',
      status: 'pending',
      donatedAt: '2024-01-16 14:20:00',
      receivedBy: null,
      note: 'Có một số quần áo trẻ em',
      totalWeight: 4.2
    },
    {
      id: 3,
      donorName: 'Lê Văn C',
      donorEmail: 'levanc@email.com',
      donorPhone: '0369852147',
      clothingItems: [
        { type: 'Quần short', condition: 'Mới 70%', quantity: 8, size: 'M, L, XL', color: 'Đa màu' },
        { type: 'Áo polo', condition: 'Mới 80%', quantity: 5, size: 'L, XL', color: 'Xanh, Đỏ' }
      ],
      eventId: 2,
      eventName: 'Thu gom quần áo cũ - Công viên Tao Đàn',
      status: 'received',
      donatedAt: '2024-01-17 09:15:00',
      receivedBy: 'Nguyễn Văn D',
      note: 'Quần áo nam, tình trạng tốt',
      totalWeight: 3.1
    },
    {
      id: 4,
      donorName: 'Phạm Thị D',
      donorEmail: 'phamthid@email.com',
      donorPhone: '0258741963',
      clothingItems: [
        { type: 'Đầm', condition: 'Mới 90%', quantity: 3, size: 'S, M', color: 'Hoa văn' },
        { type: 'Áo len', condition: 'Mới 85%', quantity: 4, size: 'M, L', color: 'Nâu, Xám' },
        { type: 'Quần tây', condition: 'Mới 80%', quantity: 2, size: 'M', color: 'Đen' }
      ],
      eventId: 2,
      eventName: 'Thu gom quần áo cũ - Công viên Tao Đàn',
      status: 'processing',
      donatedAt: '2024-01-18 16:45:00',
      receivedBy: 'Lê Thị E',
      note: 'Quần áo nữ, chất lượng cao',
      totalWeight: 2.8
    },
    {
      id: 5,
      donorName: 'Hoàng Văn E',
      donorEmail: 'hoangvane@email.com',
      donorPhone: '0147258369',
      clothingItems: [
        { type: 'Áo thể thao', condition: 'Mới 75%', quantity: 10, size: 'S, M, L', color: 'Đa màu' },
        { type: 'Quần thể thao', condition: 'Mới 70%', quantity: 8, size: 'M, L, XL', color: 'Đen, Xanh' }
      ],
      eventId: 3,
      eventName: 'Thu gom quần áo cũ - Trung tâm thương mại',
      status: 'rejected',
      donatedAt: '2024-01-19 11:30:00',
      receivedBy: null,
      note: 'Một số quần áo bị ố vàng, không đạt tiêu chuẩn',
      totalWeight: 3.5
    },
    {
      id: 6,
      donorName: 'Võ Thị F',
      donorEmail: 'vothif@email.com',
      donorPhone: '0321654987',
      clothingItems: [
        { type: 'Áo trẻ em', condition: 'Mới 95%', quantity: 12, size: '2-8 tuổi', color: 'Đa màu' },
        { type: 'Quần trẻ em', condition: 'Mới 90%', quantity: 10, size: '2-8 tuổi', color: 'Đa màu' }
      ],
      eventId: 3,
      eventName: 'Thu gom quần áo cũ - Trung tâm thương mại',
      status: 'received',
      donatedAt: '2024-01-20 13:20:00',
      receivedBy: 'Phạm Văn G',
      note: 'Quần áo trẻ em rất đẹp, con đã lớn không mặc được',
      totalWeight: 1.8
    }
  ];

  const [donationData, setDonationData] = useState(mockDonations);

  // Filtered data
  const filteredData = useMemo(() => {
    return donationData.filter(donation => {
      const matchesSearch = 
        donation.donorName.toLowerCase().includes(searchText.toLowerCase()) ||
        donation.donorEmail.toLowerCase().includes(searchText.toLowerCase()) ||
        donation.eventName.toLowerCase().includes(searchText.toLowerCase()) ||
        donation.clothingItems.some(item => 
          item.type.toLowerCase().includes(searchText.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, donationData]);

  // Statistics
  const stats = useMemo(() => {
    const total = donationData.length;
    const received = donationData.filter(d => d.status === 'received').length;
    const pending = donationData.filter(d => d.status === 'pending').length;
    const processing = donationData.filter(d => d.status === 'processing').length;
    const rejected = donationData.filter(d => d.status === 'rejected').length;
    const totalWeight = donationData
      .filter(d => d.status === 'received' && d.totalWeight)
      .reduce((sum, d) => sum + d.totalWeight, 0);
    const totalItems = donationData
      .filter(d => d.status === 'received')
      .reduce((sum, d) => sum + d.clothingItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    return { total, received, pending, processing, rejected, totalWeight, totalItems };
  }, [donationData]);

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddDonation = (newDonation) => {
    const updatedData = [...donationData, newDonation];
    setDonationData(updatedData);
    message.success('Thêm quyên góp thành công!');
  };

  const handleView = (donation) => {
    setSelectedDonation(donation);
    setDetailModalVisible(true);
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setEditModalVisible(true);
  };

  const handleUpdateDonation = (updatedDonation) => {
    const updatedData = donationData.map(donation =>
      donation.id === updatedDonation.id ? updatedDonation : donation
    );
    setDonationData(updatedData);
    message.success('Cập nhật quyên góp thành công!');
  };

  const handleDelete = (id) => {
    const newData = donationData.filter(donation => donation.id !== id);
    setDonationData(newData);
    message.success('Xóa quyên góp thành công!');
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedDonation(null);
  };

  const handleCloseAdd = () => {
    setAddModalVisible(false);
  };

  const handleCloseEdit = () => {
    setEditModalVisible(false);
    setSelectedDonation(null);
  };

  const handleRefresh = () => {
    message.info('Đã làm mới dữ liệu quyên góp');
  };

  const handleExport = () => {
    message.info('Đang xuất báo cáo quyên góp...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý quyên góp</h1>
          <p className="text-gray-600">Theo dõi và quản lý các khoản quyên góp từ người dùng</p>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<FilterOutlined />}
            onClick={handleExport}
          >
            Xuất báo cáo
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lượt quyên góp"
              value={stats.total}
              suffix="lượt"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã tiếp nhận"
              value={stats.received}
              suffix="lượt"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số quần áo"
              value={stats.totalItems}
              suffix="món"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng khối lượng"
              value={stats.totalWeight}
              suffix="kg"
              valueStyle={{ color: '#fa8c16' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Search
              placeholder="Tìm kiếm theo tên, email, sự kiện, loại quần áo..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Select
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="received">Đã tiếp nhận</Option>
              <Option value="pending">Chờ xử lý</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="rejected">Từ chối</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="middle"
              className="w-full"
            >
              Thêm quyên góp
            </Button>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className="text-right">
              <span className="text-gray-600">
                {filteredData.length} / {stats.total} lượt
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Donations Table */}
      <Card>
        <DonationTable 
          data={filteredData}
          loading={false}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Card>

      {/* Donation Detail Modal */}
      <DonationDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        donation={selectedDonation}
      />

      {/* Donation Add Modal */}
      <DonationAdd
        visible={addModalVisible}
        onClose={handleCloseAdd}
        onAdd={handleAddDonation}
      />

      {/* Donation Edit Modal */}
      <DonationEdit
        visible={editModalVisible}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateDonation}
        donation={selectedDonation}
      />
    </div>
  );
};

export default DonationManagement;
