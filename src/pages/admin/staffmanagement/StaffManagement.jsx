import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Space
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import StaffTable from "./components/StaffTable";
import StaffDetail from "./components/StaffDetail";
import StaffAdd from "./components/StaffAdd";
import StaffEdit from "./components/StaffEdit";

const { Search } = Input;
const { Option } = Select;

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@greenloop.com",
      phone: "0901234567",
      position: "Quản lý",
      department: "Vận hành",
      status: "active",
      joinDate: "2023-01-15",
      avatar: null,
      salary: 15000000,
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@greenloop.com",
      phone: "0901234568",
      position: "Nhân viên",
      department: "Marketing",
      status: "active",
      joinDate: "2023-03-20",
      avatar: null,
      salary: 12000000,
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "cuong.le@greenloop.com",
      phone: "0901234569",
      position: "Nhân viên",
      department: "Kỹ thuật",
      status: "inactive",
      joinDate: "2023-02-10",
      avatar: null,
      salary: 13000000,
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung.pham@greenloop.com",
      phone: "0901234570",
      position: "Trưởng phòng",
      department: "Nhân sự",
      status: "active",
      joinDate: "2022-12-05",
      avatar: null,
      salary: 18000000,
    },
  ]);

  const [filteredData, setFilteredData] = useState(staffData);
  const [searchText, setSearchText] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Statistics
  const totalStaff = staffData.length;
  const activeStaff = staffData.filter(
    (staff) => staff.status === "active"
  ).length;
  const inactiveStaff = staffData.filter(
    (staff) => staff.status === "inactive"
  ).length;
  const departments = [...new Set(staffData.map((staff) => staff.department))]
    .length;

  // Table columns
  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={record.avatar}
            className="bg-green-100 text-green-600"
          />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.position}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-gray-400" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "department",
      key: "department",
      render: (department) => <Tag color="blue">{department}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Đang làm việc" : "Nghỉ việc"}
        </Tag>
      ),
    },

    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, filterDepartment, filterStatus);
  };

  const handleDepartmentFilter = (value) => {
    setFilterDepartment(value);
    filterData(searchText, value, filterStatus);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    filterData(searchText, filterDepartment, value);
  };

  const filterData = (search, department, status) => {
    let filtered = staffData;

    if (search) {
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(search.toLowerCase()) ||
          staff.email.toLowerCase().includes(search.toLowerCase()) ||
          staff.phone.includes(search)
      );
    }

    if (department !== "all") {
      filtered = filtered.filter((staff) => staff.department === department);
    }

    if (status !== "all") {
      filtered = filtered.filter((staff) => staff.status === status);
    }

    setFilteredData(filtered);
  };

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddStaff = (newStaff) => {
    const updatedData = [...staffData, newStaff];
    setStaffData(updatedData);
    setFilteredData(updatedData);
    message.success("Thêm nhân viên thành công!");
  };

  const handleView = (staff) => {
    setSelectedStaff(staff);
    setDetailModalVisible(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditModalVisible(true);
  };

  const handleUpdateStaff = (updatedStaff) => {
    const updatedData = staffData.map(staff =>
      staff.id === updatedStaff.id ? updatedStaff : staff
    );
    setStaffData(updatedData);
    filterData(searchText, filterDepartment, filterStatus);
    message.success("Cập nhật nhân viên thành công!");
  };

  const handleDelete = (id) => {
    const newData = staffData.filter((staff) => staff.id !== id);
    setStaffData(newData);
    filterData(searchText, filterDepartment, filterStatus);
    message.success("Xóa nhân viên thành công!");
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedStaff(null);
  };

  const handleCloseAdd = () => {
    setAddModalVisible(false);
  };

  const handleCloseEdit = () => {
    setEditModalVisible(false);
    setSelectedStaff(null);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng nhân viên"
              value={totalStaff}
              prefix={<UserOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang làm việc"
              value={activeStaff}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Nghỉ việc"
              value={inactiveStaff}
              prefix={<UserOutlined className="text-red-600" />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chức vụ"
              value={departments}
              prefix={<UserOutlined className="text-purple-600" />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 m-0">
              Danh sách nhân viên
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Thêm nhân viên
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <Search
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="flex-1"
          />
          <Select
            placeholder="Lọc theo chức vụ"
            size="large"
            value={filterDepartment}
            onChange={handleDepartmentFilter}
            className="w-full sm:w-48"
          >
            <Option value="all">Tất cả chức vụ</Option>
            <Option value="Vận hành">Vận hành</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Kỹ thuật">Kỹ thuật</Option>
            <Option value="Nhân sự">Nhân sự</Option>
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            size="large"
            value={filterStatus}
            onChange={handleStatusFilter}
            className="w-full sm:w-48"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Đang làm việc</Option>
            <Option value="inactive">Nghỉ việc</Option>
          </Select>
        </div>

        {/* Table */}
        <StaffTable
          filteredData={filteredData}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Card>

      {/* Staff Detail Modal */}
      <StaffDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        staff={selectedStaff}
      />

      {/* Staff Add Modal */}
      <StaffAdd
        visible={addModalVisible}
        onClose={handleCloseAdd}
        onAdd={handleAddStaff}
      />

      {/* Staff Edit Modal */}
      <StaffEdit
        visible={editModalVisible}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateStaff}
        staff={selectedStaff}
      />

    </motion.div>
  );
};

export default StaffManagement;
