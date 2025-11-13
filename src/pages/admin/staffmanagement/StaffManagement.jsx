import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Input,
  Select,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Spin
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
import { getEmployees, updateEmployeeStatus } from "../../../service/api/employeeApi";

const { Search } = Input;
const { Option } = Select;

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        search: searchText,
        status: filterStatus === 'all' ? null : filterStatus === 'active',
        sortBy: 'createdAt',
        sortDir: 'DESC'
      };

      const response = await getEmployees(params);
      
      if (response.success && response.data) {
        // Role mapping
        const roleMapping = {
          'ADMIN': 'Quản trị viên',
          'MANAGER': 'Quản lý',
          'STORE_MANAGER': 'Quản lý cửa hàng',
          'SUPPORT_STAFF': 'Nhân viên hỗ trợ',
          'STAFF': 'Nhân viên'
        };

        // Map API data to component format
        const mappedData = response.data.content.map(employee => {
          // Lấy role từ array roles (API trả về roles là array)
          const roleName = employee.roles && employee.roles.length > 0 
            ? employee.roles[0] 
            : 'STAFF';
          const roleDisplay = roleMapping[roleName] || roleName;
          
          return {
            id: employee.id,
            name: employee.fullName,
            email: employee.email,
            phone: employee.phoneNumber || 'Chưa có',
            position: roleDisplay,
            department: roleDisplay,
            role: roleName,
            status: employee.isActive ? 'active' : 'inactive',
            joinDate: employee.createdAt,
            avatar: employee.avatarUrl,
            salary: 0 // API chưa trả về thông tin lương
          };
        });

        setStaffData(mappedData);
        setFilteredData(mappedData);
        setPagination(prev => ({
          ...prev,
          total: response.data.totalElements
        }));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Không thể tải danh sách nhân viên!');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, filterStatus]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Statistics
  const totalStaff = pagination.total || staffData.length;
  const activeStaff = staffData.filter(
    (staff) => staff.status === "active"
  ).length;
  const inactiveStaff = staffData.filter(
    (staff) => staff.status === "inactive"
  ).length;
  const departments = [...new Set(staffData.map((staff) => staff.department))]
    .length;

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 }); // Reset về trang 1 khi search
  };

  const handleDepartmentFilter = (value) => {
    setFilterDepartment(value);
    // Filter local data theo department (vì API chưa hỗ trợ)
    if (value === 'all') {
      setFilteredData(staffData);
    } else {
      const filtered = staffData.filter(staff => staff.department === value);
      setFilteredData(filtered);
    }
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    setPagination({ ...pagination, current: 1 }); // Reset về trang 1 khi filter
  };

  const handleTableChange = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
      total: pagination.total
    });
  };

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddStaff = async () => {
    // Refresh employee list after successful addition
    await fetchEmployees();
  };

  const handleView = (staff) => {
    setSelectedStaff(staff);
    setDetailModalVisible(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditModalVisible(true);
  };

  const handleUpdateStaff = async () => {
    // Refresh employee list after successful update
    await fetchEmployees();
  };

  const handleToggleStatus = async (staff) => {
    try {
      const newStatus = staff.status === 'active' ? false : true;
      await updateEmployeeStatus(staff.id, newStatus);
      
      // Cập nhật lại danh sách
      await fetchEmployees();
      message.success(`Cập nhật trạng thái thành công!`);
    } catch (error) {
      console.error('Error updating employee status:', error);
      message.error('Không thể cập nhật trạng thái nhân viên!');
    }
  };

  const handleDelete = (id) => {
    // Tạm thời giữ logic xóa local (cần API xóa employee)
    const newData = staffData.filter((staff) => staff.id !== id);
    setStaffData(newData);
    setFilteredData(newData);
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
            <Option value="Quản trị viên">Quản trị viên</Option>
            <Option value="Quản lý">Quản lý</Option>
            <Option value="Quản lý cửa hàng">Quản lý cửa hàng</Option>
            <Option value="Nhân viên hỗ trợ">Nhân viên hỗ trợ</Option>
            <Option value="Nhân viên">Nhân viên</Option>
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
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <StaffTable
            filteredData={filteredData}
            handleView={handleView}
            handleEdit={handleEdit}
            handleToggleStatus={handleToggleStatus}
            handleDelete={handleDelete}
            pagination={pagination}
            handleTableChange={handleTableChange}
          />
        </Spin>
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
