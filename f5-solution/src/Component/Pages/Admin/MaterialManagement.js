import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Row, Col, Select, DatePicker, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import './MaterialManagement.css';  // Đảm bảo bạn có file CSS tương ứng

const { RangePicker } = DatePicker;
const { Option } = Select;

const MaterialManagement = () => {
    const [materials, setMaterials] = useState([
        { key: 1, code: 'M_001', name: 'Cotton', dateCreated: '2024-01-15', status: 'Active' },
        { key: 2, code: 'M_002', name: 'Polyester', dateCreated: '2024-02-10', status: 'Inactive' },
        // Dữ liệu mẫu
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [dateRange, setDateRange] = useState([]);

    const handleDelete = (key) => {
        setMaterials(materials.filter((item) => item.key !== key));
    };

    const handleEdit = (record) => {
        setEditingMaterial(record);
        setIsModalVisible(true);
    };

    const handleAddNew = () => {
        setEditingMaterial(null);
        setIsModalVisible(true);
    };

    const handleSave = (values) => {
        if (editingMaterial) {
            setMaterials(materials.map((material) =>
                (material.key === editingMaterial.key
                    ? { ...values, key: editingMaterial.key, dateCreated: moment().format('YYYY-MM-DD'), status: values.status ? 'Active' : 'Inactive' }
                    : material)));
        } else {
            setMaterials([...materials, { ...values, key: materials.length + 1, dateCreated: moment().format('YYYY-MM-DD'), status: values.status ? 'Active' : 'Inactive' }]);
        }
        setIsModalVisible(false);
    };

    const handleSearch = () => {
        let filteredMaterials = materials;

        // Lọc theo tên hoặc mã
        if (searchText) {
            filteredMaterials = filteredMaterials.filter((material) =>
                material.code.toLowerCase().includes(searchText.toLowerCase()) ||
                material.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Lọc theo trạng thái
        if (selectedStatus) {
            filteredMaterials = filteredMaterials.filter((material) => material.status === selectedStatus);
        }

        // Lọc theo ngày tạo
        if (dateRange.length > 0) {
            const [startDate, endDate] = dateRange;
            filteredMaterials = filteredMaterials.filter((material) => {
                const materialDate = moment(material.dateCreated);
                return materialDate.isBetween(startDate, endDate, 'day', '[]'); // Bao gồm cả ngày bắt đầu và kết thúc
            });
        }

        return filteredMaterials;
    };

    const handleStatusChange = (checked, record) => {
        setMaterials(materials.map((material) =>
            material.key === record.key ? { ...material, status: checked ? 'Active' : 'Inactive' } : material
        ));
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Mã chất liệu',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên chất liệu',
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
        <div className="material-management-container">
            <div className="sidebar">
                <h2>Quản lý chất liệu</h2>
                <ul>
                    <li>
                        <Input
                            placeholder="Tìm kiếm tên hoặc mã chất liệu..."
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
                <h1>Quản lý chất liệu</h1>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: '20px' }}
                    onClick={handleAddNew}
                >
                    Thêm chất liệu mới
                </Button>

                <Table columns={columns} dataSource={handleSearch()} pagination={{ pageSize: 5 }} />

                <Modal
                    title={editingMaterial ? "Chỉnh sửa chất liệu" : "Thêm chất liệu mới"}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Form
                        initialValues={editingMaterial || { code: '', name: '', status: true }}
                        onFinish={handleSave}
                    >
                        <Form.Item
                            label="Mã chất liệu"
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã chất liệu!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tên chất liệu"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên chất liệu!' }]}
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

export default MaterialManagement;
