import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Select, Row, Col, Card, Tag, Modal, notification, Space, List, Radio, Switch, Image } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import './CounterSale.css';

const { Option } = Select;

const CounterSale = () => {
    const [invoices, setInvoices] = useState([
        {
            key: 1,
            code: 'HD001',
            staff: 'Nguyễn Văn Toàn',
            dateCreated: '2024-03-01 09:00:00',
            customer: 'Khánh Lê',
            type: 'Tại quầy',
            status: 'Chờ thanh toán',
        },
        {
            key: 2,
            code: 'HD002',
            staff: 'Trần Văn Bình',
            dateCreated: '2024-03-02 10:00:00',
            customer: 'Minh Phương',
            type: 'Giao hàng',
            status: 'Đã thanh toán',
        },
        {
            key: 3,
            code: 'HD003',
            staff: 'Trần Văn Hình',
            dateCreated: '2024-03-02 10:00:00',
            customer: 'Minh Phương',
            type: 'Giao hàng',
            status: 'Đã thanh toán',
        }
    ]);

    const [invoiceDetails, setInvoiceDetails] = useState([
        {
            key: 1,
            image: 'https://via.placeholder.com/50',
            product: 'Áo thun nam',
            quantity: 2,
            unitPrice: 120000,
            totalPrice: 240000,
        }
    ]);

    const [searchText, setSearchText] = useState(""); // Tìm kiếm hóa đơn
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal thêm/sửa hóa đơn
    const [editingInvoice, setEditingInvoice] = useState(null); // Hóa đơn đang chỉnh sửa
    const [isProductModalVisible, setIsProductModalVisible] = useState(false); // Modal thêm/sửa sản phẩm
    const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
    const [form] = Form.useForm();
    const [productForm] = Form.useForm();
    const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền hóa đơn
    const [isProductSelectVisible, setIsProductSelectVisible] = useState(false); // Modal chọn sản phẩm
    const [isCustomerSelectVisible, setIsCustomerSelectVisible] = useState(false); // Modal chọn khách hàng
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Khách hàng được chọn
    const [paymentMethod, setPaymentMethod] = useState('cash'); // Phương thức thanh toán
    const [amountPaid, setAmountPaid] = useState(0); // Số tiền khách trả
    const [paymentStatus, setPaymentStatus] = useState('Chờ thanh toán'); // Trạng thái thanh toán
    const [showQRCode, setShowQRCode] = useState(false); // Hiển thị QR code khi chọn "Chuyển khoản"

    // Cập nhật tổng số tiền dựa trên chi tiết hóa đơn
    useEffect(() => {
        const total = invoiceDetails.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    }, [invoiceDetails]);

    // Hiển thị QR code khi chọn "Chuyển khoản"
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        setShowQRCode(e.target.value === 'transfer');
    };

    // Tăng số lượng sản phẩm
    const increaseQuantity = (key) => {
        setInvoiceDetails(invoiceDetails.map(product => {
            if (product.key === key) {
                return {
                    ...product,
                    quantity: product.quantity + 1,
                    totalPrice: product.unitPrice * (product.quantity + 1)
                };
            }
            return product;
        }));
    };

    // Giảm số lượng sản phẩm
    const decreaseQuantity = (key) => {
        setInvoiceDetails(invoiceDetails.map(product => {
            if (product.key === key && product.quantity > 1) {
                return {
                    ...product,
                    quantity: product.quantity - 1,
                    totalPrice: product.unitPrice * (product.quantity - 1)
                };
            }
            return product;
        }));
    };

    // Lưu hoặc cập nhật hóa đơn
    const handleSaveInvoice = (values) => {
        if (editingInvoice) {
            setInvoices(invoices.map((invoice) =>
                invoice.key === editingInvoice.key ? { ...values, key: editingInvoice.key, status: paymentStatus } : invoice
            ));
            notification.success({ message: 'Hóa đơn đã được cập nhật!' });
        } else {
            const newInvoice = {
                ...values,
                key: invoices.length + 1,
                dateCreated: new Date().toLocaleString(),
                status: paymentStatus,
            };
            setInvoices([...invoices, newInvoice]);
            notification.success({ message: 'Hóa đơn mới đã được tạo!' });
        }
        setIsModalVisible(false);
        form.resetFields();
        setEditingInvoice(null);
    };

    // Chỉnh sửa hóa đơn
    const handleEditInvoice = (record) => {
        setEditingInvoice(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    // Xóa hóa đơn
    const handleDeleteInvoice = (key) => {
        setInvoices(invoices.filter((invoice) => invoice.key !== key));
        notification.success({ message: 'Hóa đơn đã bị xóa!' });
    };

    // Lưu hoặc cập nhật sản phẩm
    const handleSaveProduct = (values) => {
        const totalPrice = values.quantity * values.unitPrice;
        if (editingProduct) {
            setInvoiceDetails(invoiceDetails.map((product) =>
                product.key === editingProduct.key ? { ...values, totalPrice, key: editingProduct.key } : product
            ));
            notification.success({ message: 'Sản phẩm đã được cập nhật!' });
        } else {
            const newProduct = {
                ...values,
                key: invoiceDetails.length + 1,
                totalPrice,
            };
            setInvoiceDetails([...invoiceDetails, newProduct]);
            notification.success({ message: 'Sản phẩm mới đã được thêm!' });
        }
        setIsProductModalVisible(false);
        productForm.resetFields();
        setEditingProduct(null);
    };

    // Chỉnh sửa sản phẩm
    const handleEditProduct = (record) => {
        setEditingProduct(record);
        productForm.setFieldsValue(record);
        setIsProductModalVisible(true);
    };

    // Xóa sản phẩm
    const handleDeleteProduct = (key) => {
        setInvoiceDetails(invoiceDetails.filter((product) => product.key !== key));
        notification.success({ message: 'Sản phẩm đã bị xóa!' });
    };

    // Chọn sản phẩm
    const handleSelectProduct = (product) => {
        const newProduct = {
            key: invoiceDetails.length + 1,
            product: product.name,
            quantity: 1,
            unitPrice: product.price,
            totalPrice: product.price
        };
        setInvoiceDetails([...invoiceDetails, newProduct]);
        setIsProductSelectVisible(false);
    };

    // Danh sách sản phẩm mẫu để chọn
    const productList = [
        { key: 1, name: 'Áo thun nam', price: 120000 },
        { key: 2, name: 'Quần jeans nữ', price: 350000 },
        { key: 3, name: 'Giày thể thao', price: 500000 }
    ];

    // Danh sách khách hàng mẫu để tìm kiếm
    const customerList = [
        { key: 1, name: 'Khánh Lê', phone: '0123456789' },
        { key: 2, name: 'Minh Phương', phone: '0987654321' }
    ];

    // Chọn khách hàng
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer.name);
        setIsCustomerSelectVisible(false);
    };

    const handlePayment = () => {
        if (amountPaid >= totalAmount) {
            // Cập nhật trạng thái hóa đơn thành "Đã thanh toán"
            setInvoices(invoices.map((invoice) =>
                invoice.key === editingInvoice.key ? { ...invoice, status: 'Đã thanh toán' } : invoice
            ));
            notification.success({ message: 'Thanh toán thành công!' });
            setPaymentStatus('Đã thanh toán');
        } else {
            notification.error({ message: 'Thanh toán không đủ!' });
            setPaymentStatus('Chờ thanh toán');
        }
    };

    const filteredInvoices = invoices.filter(
        (invoice) =>
            invoice.code.toLowerCase().includes(searchText.toLowerCase()) ||
            invoice.customer.toLowerCase().includes(searchText.toLowerCase())
    );

    const columnsInvoices = [
        { title: 'Mã Hóa Đơn', dataIndex: 'code', key: 'code' },
        { title: 'Nhân Viên', dataIndex: 'staff', key: 'staff' },
        { title: 'Ngày Tạo', dataIndex: 'dateCreated', key: 'dateCreated' },
        { title: 'Khách Hàng', dataIndex: 'customer', key: 'customer' },
        { title: 'Loại Đơn', dataIndex: 'type', key: 'type' },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color="blue">{status}</Tag>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditInvoice(record)}>Sửa</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteInvoice(record.key)} danger>Xóa</Button>
                </Space>
            ),
        },
    ];

    // Cột cho bảng quản lý sản phẩm (hiển thị chi tiết sản phẩm và thao tác)
    const columnsProductDetails = [
        { title: 'STT', dataIndex: 'key', key: 'key' },
        { title: 'Ảnh', dataIndex: 'image', key: 'image', render: (image) => <img src={image} alt="Product" style={{ width: 50 }} /> },
        { title: 'Sản phẩm', dataIndex: 'product', key: 'product' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', render: (quantity, record) => (
            <Space>
                <Button icon={<MinusOutlined />} onClick={() => decreaseQuantity(record.key)} />
                {quantity}
                <Button icon={<PlusOutlined />} onClick={() => increaseQuantity(record.key)} />
            </Space>
        ) },
        { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', render: (price) => `${price.toLocaleString('vi-VN')} vnđ` },
        { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice', render: (total) => `${total.toLocaleString('vi-VN')} vnđ` },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record)}>Sửa</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.key)} danger>Xóa</Button>
                </Space>
            ),
        },
    ];

    // Cột cho bảng hiển thị thông tin hóa đơn (không bao gồm số lượng và thao tác)
    const columnsInvoiceDetails = [
        { title: 'STT', dataIndex: 'key', key: 'key' },
        { title: 'Ảnh', dataIndex: 'image', key: 'image', render: (image) => <img src={image} alt="Product" style={{ width: 50 }} /> },
        { title: 'Sản phẩm', dataIndex: 'product', key: 'product' },
        { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', render: (price) => `${price.toLocaleString('vi-VN')} vnđ` },
        { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice', render: (total) => `${total.toLocaleString('vi-VN')} vnđ` },
    ];

    return (
        <div className="counter-sale-container">
            {/* Banner trên cùng
            <div className="top-banner">Mua hàng với ưu đãi...</div> */}

            {/* Danh sách hóa đơn */}
            <div className="invoice-section">
                <Input
                    placeholder="Tìm kiếm hóa đơn..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: '20px', width: '300px' }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    Tạo hóa đơn mới
                </Button>
                <Table columns={columnsInvoices} dataSource={filteredInvoices} pagination={false} />
            </div>

            {/* Chi tiết sản phẩm trong hóa đơn */}
            <div className="product-details-section">
                <Table columns={columnsProductDetails} dataSource={invoiceDetails} pagination={false} />
                <Button type="primary" className="add-product-btn" onClick={() => setIsProductSelectVisible(true)}>Chọn sản phẩm</Button>
            </div>

            {/* Thông tin khách hàng và dịch vụ khác */}
            <Row gutter={20}>
                <Col span={12}>
                    <Card title="Thông tin khách hàng" className="info-card">
                        <Form layout="vertical">
                            <Form.Item label="Tên khách hàng">
                                <Input value={selectedCustomer} readOnly />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={() => setIsCustomerSelectVisible(true)}>Chọn khách hàng</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Dịch vụ khác" className="info-card">
                        <Form layout="vertical">
                            <Form.Item label="Dịch vụ giao hàng">
                                <Switch checkedChildren="Có" unCheckedChildren="Không" />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {/* Hình thức thanh toán và thông tin hóa đơn */}
            <Row gutter={20}>
                <Col span={12}>
                    <Card title="Hình Thức Thanh Toán" className="info-card">
                        <Form.Item label="Hình thức thanh toán">
                            <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                                <Radio value="cash">Tiền mặt</Radio>
                                <Radio value="transfer">Chuyển khoản</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {paymentMethod === 'cash' && (
                            <Form.Item label="Số tiền khách trả">
                                <Input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
                            </Form.Item>
                        )}
                        {showQRCode && (
                            <div style={{ marginTop: '20px' }}>
                                <Image src='/mnt/data/image.png' alt="QR Code" width={200} />
                            </div>
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Thông Tin Hóa Đơn" className="info-card">
                        <Table columns={columnsInvoiceDetails} dataSource={invoiceDetails} pagination={false} />
                        <Row>
                            <Col span={12}>Tổng tiền sản phẩm:</Col>
                            <Col span={12} style={{ textAlign: 'right' }}>{totalAmount.toLocaleString('vi-VN')} vnđ</Col>
                        </Row>
                        {paymentMethod === 'cash' && (
                            <Row>
                                <Col span={12}>Còn lại phải trả:</Col>
                                <Col span={12} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {(totalAmount - amountPaid).toLocaleString('vi-VN')} vnđ
                                </Col>
                            </Row>
                        )}
                        <Button type="primary" block style={{ marginTop: '20px' }} onClick={handlePayment}>
                            Xác nhận thanh toán
                        </Button>
                    </Card>
                </Col>
            </Row>

            {/* Modal chọn sản phẩm */}
            <Modal
                title="Chọn sản phẩm"
                visible={isProductSelectVisible}
                onCancel={() => setIsProductSelectVisible(false)}
                footer={null}
            >
                <List
                    dataSource={productList}
                    renderItem={(item) => (
                        <List.Item>
                            <Button onClick={() => handleSelectProduct(item)}>
                                {item.name} - {item.price.toLocaleString('vi-VN')} vnđ
                            </Button>
                        </List.Item>
                    )}
                />
            </Modal>

            {/* Modal chọn khách hàng */}
            <Modal
                title="Chọn khách hàng"
                visible={isCustomerSelectVisible}
                onCancel={() => setIsCustomerSelectVisible(false)}
                footer={null}
            >
                <Input.Search
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                    onSearch={(value) => console.log(value)}
                />
                <List
                    dataSource={customerList}
                    renderItem={(item) => (
                        <List.Item>
                            <Button onClick={() => handleSelectCustomer(item)}>
                                {item.name} - {item.phone}
                            </Button>
                        </List.Item>
                    )}
                />
            </Modal>

            {/* Modal thêm/sửa hóa đơn */}
            <Modal
                title={editingInvoice ? "Sửa hóa đơn" : "Thêm hóa đơn"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSaveInvoice} layout="vertical">
                    <Form.Item name="code" label="Mã hóa đơn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="staff" label="Nhân viên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="customer" label="Khách hàng" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Loại đơn" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Tại quầy">Tại quầy</Option>
                            <Option value="Giao hàng">Giao hàng</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal thêm/sửa sản phẩm */}
            <Modal
                title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
                visible={isProductModalVisible}
                onCancel={() => setIsProductModalVisible(false)}
                footer={null}
            >
                <Form form={productForm} onFinish={handleSaveProduct} layout="vertical">
                    <Form.Item name="product" label="Sản phẩm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="unitPrice" label="Đơn giá" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CounterSale;
