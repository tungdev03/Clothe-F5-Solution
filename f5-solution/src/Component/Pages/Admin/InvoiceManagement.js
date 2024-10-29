import React, { useState } from 'react';
import { Table, Button, Input, Space, Select, Tag, Row, Col, Card, Modal, Form, notification } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './InvoiceManagement.css';

const { Option } = Select;

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([
        {
            key: 1,
            code: 'HD001',
            customer: 'Nguyễn Văn Toàn',
            dateCreated: '2024-03-01',
            phoneNumber: '0965452400',
            total: 529000,
            type: 'Đơn lẻ',
            status: 'Chờ xác nhận',
        },
        {
            key: 2,
            code: 'HD002',
            customer: 'Nguyễn Văn Toàn',
            dateCreated: '2024-03-01',
            phoneNumber: '0965452400',
            total: 658000,
            type: 'Đơn lẻ',
            status: 'Đã xác nhận',
        },
        {
            key: 3,
            code: 'HD003',
            customer: 'Khánh Lê',
            dateCreated: '2024-03-05',
            phoneNumber: '0985142321',
            total: 230000,
            type: 'Đơn lẻ',
            status: 'Hoàn thành',
        },
        {
            key: 4,
            code: 'HD004',
            customer: 'Hoàng',
            dateCreated: '2024-03-12',
            phoneNumber: '0905213900',
            total: 230000,
            type: 'Đơn trả lại',
            status: 'Đơn huỷ',
        },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [form] = Form.useForm();

    // Thêm hóa đơn mới
    const handleAddNew = () => {
        setEditingInvoice(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Lưu hóa đơn sau khi thêm hoặc sửa
    const handleSave = (values) => {
        if (editingInvoice) {
            // Chỉnh sửa hóa đơn
            setInvoices(invoices.map((invoice) => 
                invoice.key === editingInvoice.key ? { ...values, key: editingInvoice.key, dateCreated: editingInvoice.dateCreated } : invoice
            ));
            notification.success({ message: 'Hóa đơn đã được cập nhật!' });
        } else {
            // Thêm mới hóa đơn
            const newInvoice = {
                ...values,
                key: invoices.length + 1,
                dateCreated: new Date().toISOString().slice(0, 10),
            };
            setInvoices([...invoices, newInvoice]);
            notification.success({ message: 'Hóa đơn đã được thêm mới!' });
        }
        setIsModalVisible(false);
    };

    // Chỉnh sửa hóa đơn
    const handleEdit = (record) => {
        setEditingInvoice(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    // Xóa hóa đơn
    const handleDelete = (key) => {
        setInvoices(invoices.filter((invoice) => invoice.key !== key));
        notification.success({ message: 'Hóa đơn đã bị xóa!' });
    };

    // Lọc hóa đơn dựa trên tìm kiếm và trạng thái
    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearchText =
            invoice.code.toLowerCase().includes(searchText.toLowerCase()) ||
            invoice.customer.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus =
            selectedStatus === 'all' || invoice.status === selectedStatus;

        return matchesSearchText && matchesStatus;
    });

    // Đếm số lượng hóa đơn theo trạng thái
    const statusCounts = {
        'Chờ xác nhận': invoices.filter((invoice) => invoice.status === 'Chờ xác nhận').length,
        'Đã xác nhận': invoices.filter((invoice) => invoice.status === 'Đã xác nhận').length,
        'Chờ giao': invoices.filter((invoice) => invoice.status === 'Chờ giao').length,
        'Hoàn thành': invoices.filter((invoice) => invoice.status === 'Hoàn thành').length,
        'Đơn huỷ': invoices.filter((invoice) => invoice.status === 'Đơn huỷ').length,
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
        },
        {
            title: 'Số điện thoại khách',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `${total.toLocaleString('vi-VN')} vnđ`,
        },
        {
            title: 'Loại đơn',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'green';
                if (status === 'Chờ xác nhận') {
                    color = 'volcano';
                } else if (status === 'Đơn huỷ') {
                    color = 'red';
                } else if (status === 'Đã xác nhận') {
                    color = 'blue';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Action',
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
        <div className="invoice-management-container">
            {/* <div className="header">
                <Input.Search
                    placeholder="Tìm kiếm..."
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div> */}

            {/* Thẻ trạng thái */}
            <Row gutter={16} className="status-cards" justify="center">
                <Col span={4}>
                    <Card title="Chờ xác nhận" bordered={false} className="status-card">
                        {statusCounts['Chờ xác nhận']}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card title="Đã xác nhận" bordered={false} className="status-card">
                        {statusCounts['Đã xác nhận']}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card title="Chờ giao" bordered={false} className="status-card">
                        {statusCounts['Chờ giao']}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card title="Hoàn thành" bordered={false} className="status-card">
                        {statusCounts['Hoàn thành']}
                    </Card>
                </Col>
                <Col span={4}>
                    <Card title="Đơn huỷ" bordered={false} className="status-card">
                        {statusCounts['Đơn huỷ']}
                    </Card>
                </Col>
            </Row>

            <div className="filter-section">
                <Row>
                    <Col span={10}>
                        <Input class name="search"
                            placeholder="Tìm kiếm theo mã hoá đơn, tên khách hàng..."
                            value={searchText}
                            style={{ width: '300px' }}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>

                    </Row>
                    <Col span={4}> 
                        <Select
                            defaultValue="Tất cả các đơn"
                            style={{ width: '250px' }}
                            value={selectedStatus}
                            onChange={(value) => setSelectedStatus(value)}
                        >
                            <Option value="all">Tất cả các đơn</Option>
                            <Option value="Chờ xác nhận">Chờ xác nhận</Option>
                            <Option value="Đã xác nhận">Đã xác nhận</Option>
                            <Option value="Chờ giao">Chờ giao</Option>
                            <Option value="Hoàn thành">Hoàn thành</Option>
                            <Option value="Đơn huỷ">Đơn huỷ</Option>
                        </Select>
                    </Col>
                    <Col span={4} offset={6}>
                        <Button type="primary" style={{ backgroundColor: 'black' }} icon={<PlusOutlined />} onClick={handleAddNew}>
                            Tạo hoá đơn
                        </Button>
                    </Col>
                
            </div>

            <Table columns={columns} dataSource={filteredInvoices} pagination={{ pageSize: 5 }} />

            <Modal
                title={editingInvoice ? 'Chỉnh sửa hóa đơn' : 'Thêm hóa đơn mới'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item label="Mã hóa đơn" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã hóa đơn!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tên khách hàng" name="customer" rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        label="Số điện thoại khách" 
                        name="phoneNumber" 
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Thành tiền" name="total" rules={[{ required: true, message: 'Vui lòng nhập thành tiền!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Loại đơn" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại đơn!' }]}>
                        <Select>
                            <Option value="Đơn lẻ">Đơn lẻ</Option>
                            <Option value="Đơn trả lại">Đơn trả lại</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                        <Select>
                            <Option value="Chờ xác nhận">Chờ xác nhận</Option>
                            <Option value="Đã xác nhận">Đã xác nhận</Option>
                            <Option value="Hoàn thành">Hoàn thành</Option>
                            <Option value="Đơn huỷ">Đơn huỷ</Option>
                            <Option value="Chờ giao">Chờ giao</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InvoiceManagement;
