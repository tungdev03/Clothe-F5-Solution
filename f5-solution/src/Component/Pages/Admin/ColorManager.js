import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Row, Col, Select, DatePicker, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import './ColorManagement.css';  // Đảm bảo tạo file CSS

const { RangePicker } = DatePicker;
const { Option } = Select;

const ColorManagement = () => {
    const [colors, setColors] = useState([
        { key: 1, code: 'M_001', name: 'Đỏ', dateCreated: '2024-01-15', status: 'Active' },
        { key: 2, code: 'M_002', name: 'Xanh', dateCreated: '2024-02-10', status: 'Inactive' },
        // Dữ liệu mẫu
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingColor, setEditingColor] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [dateRange, setDateRange] = useState([]);

    const handleDelete = (key) => {
        setColors(colors.filter((item) => item.key !== key));
    };

    const handleEdit = (record) => {
        setEditingColor(record);
        setIsModalVisible(true);
    };

    const handleAddNew = () => {
        setEditingColor(null);
        setIsModalVisible(true);
    };

    const handleSave = (values) => {
        if (editingColor) {
            setColors(colors.map((color) =>
                (color.key === editingColor.key
                    ? { ...values, key: editingColor.key, dateCreated: moment().format('YYYY-MM-DD'), status: values.status ? 'Active' : 'Inactive' }
                    : color)));
        } else {
            setColors([...colors, { ...values, key: colors.length + 1, dateCreated: moment().format('YYYY-MM-DD'), status: values.status ? 'Active' : 'Inactive' }]);
        }
        setIsModalVisible(false);
    };

    const handleSearch = () => {
        let filteredColors = colors;

        // Lọc theo tên hoặc mã
        if (searchText) {
            filteredColors = filteredColors.filter((color) =>
                color.code.toLowerCase().includes(searchText.toLowerCase()) ||
                color.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Lọc theo trạng thái
        if (selectedStatus) {
            filteredColors = filteredColors.filter((color) => color.status === selectedStatus);
        }

        // Lọc theo ngày tạo
        if (dateRange.length > 0) {
            const [startDate, endDate] = dateRange;
            filteredColors = filteredColors.filter((color) => {
                const colorDate = moment(color.dateCreated);
                return colorDate.isBetween(startDate, endDate, 'day', '[]'); // Bao gồm cả ngày bắt đầu và kết thúc
            });
        }

        return filteredColors;
    };

    const handleStatusChange = (checked, record) => {
        setColors(colors.map((color) =>
            color.key === record.key ? { ...color, status: checked ? 'Active' : 'Inactive' } : color
        ));
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Mã màu',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên màu',
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
        <div className="color-management-container">
            <div className="sidebar">
                <h2>Quản lý màu sắc</h2>
                <ul>
                    <li>
                        <Input
                            placeholder="Tìm kiếm tên hoặc mã màu..."
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
                <h1>Quản lý màu sắc</h1>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: '20px' }}
                    onClick={handleAddNew}
                >
                    Thêm màu mới
                </Button>

                <Table columns={columns} dataSource={handleSearch()} pagination={{ pageSize: 5 }} />

                <Modal
                    title={editingColor ? "Chỉnh sửa màu" : "Thêm màu mới"}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Form
                        initialValues={editingColor || { code: '', name: '', status: true }}
                        onFinish={handleSave}
                    >
                        <Form.Item
                            label="Mã màu"
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã màu!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tên màu"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên màu!' }]}
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

export default ColorManagement;
