import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Row, Col, Select, DatePicker, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import './SizeManagement.css';  // Đảm bảo bạn có file CSS tương ứng

const { RangePicker } = DatePicker;
const { Option } = Select;

const SizeManagement = () => {
    const [sizes, setSizes] = useState([
        { key: 1, code: 'S_001', name: 'Small', dateCreated: '2024-01-15', status: 'Active' },
        { key: 2, code: 'S_002', name: 'Medium', dateCreated: '2024-02-10', status: 'Inactive' },
        // Dữ liệu mẫu
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSize, setEditingSize] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [dateRange, setDateRange] = useState([]);

    const handleDelete = (key) => {
        setSizes(sizes.filter((item) => item.key !== key));
    };

    const handleEdit = (record) => {
        setEditingSize(record);
        setIsModalVisible(true);
    };

    const handleAddNew = () => {
        setEditingSize(null);
        setIsModalVisible(true);
    };

    const handleSave = (values) => {
        if (editingSize) {
            setSizes(sizes.map((size) =>
                (size.key === editingSize.key
                    ? { ...values, key: editingSize.key, dateCreated: moment().format('YYYY-MM-DD'), status: values.status ? 'Active' : 'Inactive' }
                    : size)));
        } else {
            setSizes([...sizes, { ...values, key: sizes.length + 1, dateCreated: moment().format('YYYY-MM-DD'), status: values.status ? 'Active' : 'Inactive' }]);
        }
        setIsModalVisible(false);
    };

    const handleSearch = () => {
        let filteredSizes = sizes;

        // Lọc theo tên hoặc mã
        if (searchText) {
            filteredSizes = filteredSizes.filter((size) =>
                size.code.toLowerCase().includes(searchText.toLowerCase()) ||
                size.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Lọc theo trạng thái
        if (selectedStatus) {
            filteredSizes = filteredSizes.filter((size) => size.status === selectedStatus);
        }

        // Lọc theo ngày tạo
        if (dateRange.length > 0) {
            const [startDate, endDate] = dateRange;
            filteredSizes = filteredSizes.filter((size) => {
                const sizeDate = moment(size.dateCreated);
                return sizeDate.isBetween(startDate, endDate, 'day', '[]'); // Bao gồm cả ngày bắt đầu và kết thúc
            });
        }

        return filteredSizes;
    };

    const handleStatusChange = (checked, record) => {
        setSizes(sizes.map((size) =>
            size.key === record.key ? { ...size, status: checked ? 'Active' : 'Inactive' } : size
        ));
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Mã kích cỡ',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên kích cỡ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status === 'Active'}
                    onChange={(checked) => handleStatusChange(checked, record)}
                />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} danger>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="size-management-container">
            <div className="sidebar">
                <h2>Quản lý kích cỡ</h2>
                <ul>
                    <li>
                        <Input
                            placeholder="Tìm kiếm tên hoặc mã kích cỡ..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="search-input"
                        />
                    </li>
                    <li>
                        <Select
                            placeholder="Chọn trạng thái"
                            style={{ width: '100%' }}
                            onChange={(value) => setSelectedStatus(value)}
                            value={selectedStatus}
                            className="status-select"
                        >
                            <Option value={null}>Tất cả</Option>
                            <Option value="Active">Đang hoạt động</Option>
                            <Option value="Inactive">Ngừng hoạt động</Option>
                        </Select>
                    </li>
                    <li>
                        <RangePicker
                            style={{ width: '100%' }}
                            onChange={(dates) => setDateRange(dates)}
                            className="date-picker"
                        />
                    </li>
                    <li>
                        <Button type="primary" onClick={handleSearch} className="filter-button">Lọc ngay</Button>
                    </li>
                </ul>
            </div>

            <div className="main-content">
                <h1>Quản lý kích cỡ</h1>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: '20px' }}
                    onClick={handleAddNew}
                >
                    Thêm kích cỡ mới
                </Button>

                <Table columns={columns} dataSource={handleSearch()} pagination={{ pageSize: 5 }} />

                <Modal
                    title={editingSize ? "Chỉnh sửa kích cỡ" : "Thêm kích cỡ mới"}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Form
                        initialValues={editingSize || { code: '', name: '', status: true }}
                        onFinish={handleSave}
                    >
                        <Form.Item
                            label="Mã kích cỡ"
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã kích cỡ!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tên kích cỡ"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên kích cỡ!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            valuePropName="checked"
                        >
                            <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default SizeManagement;
