import React, { useState } from 'react';
import { Table, Button, Input, Form, Select, Tag, Modal, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './EmployeeManagement.css'; // Import file CSS

const { Option } = Select;

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([
        {
            key: 1,
            code: 'NV001',
            name: 'Nguyễn Văn Hưng',
            gender: 'Nam',
            birthDate: '1990-01-01',
            address: 'Hà Nội',
            email: 'hungnv@gmail.com',
            phone: '0942910000',
            status: 'Ngừng hoạt động',
            image: 'https://via.placeholder.com/50',
        },
        {
            key: 2,
            code: 'NV002',
            name: 'Đỗ Lan Anh',
            gender: 'Nữ',
            birthDate: '1995-07-11',
            address: 'Hà Nam',
            email: 'lananh@gmail.com',
            phone: '0882544290',
            status: 'Hoạt động',
            image: 'https://via.placeholder.com/50',
        },
    ]);

    const [filteredEmployees, setFilteredEmployees] = useState(employees);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal thêm/sửa nhân viên
    const [editingEmployee, setEditingEmployee] = useState(null); // Nhân viên đang chỉnh sửa
    const [searchText, setSearchText] = useState(""); // Tìm kiếm
    const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
    const [form] = Form.useForm();

    // Tìm kiếm và lọc nhân viên
    const handleSearch = (text) => {
        setSearchText(text);
        filterEmployees(text, statusFilter);
    };

    const handleFilterChange = (value) => {
        setStatusFilter(value);
        filterEmployees(searchText, value);
    };

    const filterEmployees = (text, status) => {
        let filtered = employees;

        // Tìm kiếm theo tên
        if (text) {
            filtered = filtered.filter(employee =>
                employee.name.toLowerCase().includes(text.toLowerCase())
            );
        }

        // Lọc theo trạng thái
        if (status !== "all") {
            filtered = filtered.filter(employee => employee.status === (status === "active" ? "Hoạt động" : "Ngừng hoạt động"));
        }

        setFilteredEmployees(filtered);
    };

    // Thêm hoặc cập nhật nhân viên
    const handleSaveEmployee = (values) => {
        if (editingEmployee) {
            setEmployees(employees.map((employee) =>
                employee.key === editingEmployee.key ? { ...values, key: editingEmployee.key } : employee
            ));
        } else {
            const newEmployee = {
                ...values,
                key: employees.length + 1,
            };
            setEmployees([...employees, newEmployee]);
        }
        setIsModalVisible(false);
        form.resetFields();
        setEditingEmployee(null);
        filterEmployees(searchText, statusFilter);
    };

    // Chỉnh sửa nhân viên
    const handleEditEmployee = (record) => {
        setEditingEmployee(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    // Xóa nhân viên
    const handleDeleteEmployee = (key) => {
        setEmployees(employees.filter((employee) => employee.key !== key));
        filterEmployees(searchText, statusFilter);
    };

    const columns = [
        { title: 'STT', dataIndex: 'key', key: 'key' },
        { title: 'Mã Nhân Viên', dataIndex: 'code', key: 'code' },
        { title: 'Ảnh', dataIndex: 'image', key: 'image', render: (image) => <img src={image} alt="Employee" style={{ width: 50 }} /> },
        { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
        { title: 'Giới Tính', dataIndex: 'gender', key: 'gender' },
        { title: 'Ngày Sinh', dataIndex: 'birthDate', key: 'birthDate' },
        { title: 'Địa Chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số Điện Thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Hoạt động' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditEmployee(record)}>Sửa</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteEmployee(record.key)} danger>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="employee-management-container">
            <div className="filter-section">
                <Input
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="filter-controls">
                    <Select
                        value={statusFilter}
                        onChange={handleFilterChange}
                        placeholder="Chọn trạng thái"
                    >
                        <Option value="all">Tất cả</Option>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Ngừng hoạt động</Option>
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                        Thêm mới nhân viên
                    </Button>
                </div>
            </div>

            <Table columns={columns} dataSource={filteredEmployees} pagination={false} />

            {/* Modal thêm/sửa nhân viên */}
            <Modal
                title={editingEmployee ? "Sửa nhân viên" : "Thêm nhân viên"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSaveEmployee} layout="vertical">
                    <Form.Item name="code" label="Mã nhân viên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="birthDate" label="Ngày sinh" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Hoạt động">Hoạt động</Option>
                            <Option value="Ngừng hoạt động">Ngừng hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;
