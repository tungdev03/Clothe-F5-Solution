import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Select, Row, Col, Card, Tag, Modal, notification, Space, List, Radio, Switch, Image } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import './CounterSale.css';
import Anh1 from './Anh1.png';

const { Option } = Select;

const CounterSale = () => {
    const [invoices, setInvoices] = useState([
        { key: 1, code: 'HD001', staff: 'Nguyễn Văn Toàn', dateCreated: '2024-03-01 09:00:00', customer: 'Khánh Lê', type: 'Tại quầy', status: 'Chờ thanh toán' },
        { key: 2, code: 'HD002', staff: 'Trần Văn Bình', dateCreated: '2024-03-02 10:00:00', customer: 'Minh Phương', type: 'Giao hàng', status: 'Đã thanh toán' },
        { key: 3, code: 'HD003', staff: 'Trần Văn Hình', dateCreated: '2024-03-02 10:00:00', customer: 'Minh Phương', type: 'Giao hàng', status: 'Đã thanh toán' }
    ]);

    const [invoiceDetails, setInvoiceDetails] = useState([
        { key: 1, image: 'https://via.placeholder.com/50', product: 'Áo thun nam', quantity: 2, unitPrice: 120000, totalPrice: 240000 }
    ]);

    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const [productForm] = Form.useForm();
    const [totalAmount, setTotalAmount] = useState(0);
    const [isProductSelectVisible, setIsProductSelectVisible] = useState(false);
    const [isCustomerSelectVisible, setIsCustomerSelectVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('Chờ thanh toán');
    const [showQRCode, setShowQRCode] = useState(false);
    const [amountInWords, setAmountInWords] = useState("");

    // Danh sách sản phẩm và khách hàng mẫu
    const productList = [
        { key: 1, name: 'Áo thun nam', price: 120000 },
        { key: 2, name: 'Quần jeans nữ', price: 350000 },
        { key: 3, name: 'Giày thể thao', price: 500000 }
    ];

    const customerList = [
        { key: 1, name: 'Khánh Lê', phone: '0123456789' },
        { key: 2, name: 'Minh Phương', phone: '0987654321' }
    ];

    useEffect(() => {
        const total = invoiceDetails.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    }, [invoiceDetails]);
    const formatCurrency = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    
    const parseCurrency = (value) => {
        if (!value) return 0;
        return parseInt(value.replace(/\./g, ""), 10);
    };
    
    const handleAmountInputChange = (e) => {
        const rawValue = e.target.value;
        const numericValue = parseCurrency(rawValue); // Loại bỏ dấu chấm và chuyển thành số
        setAmountPaid(numericValue); // Cập nhật state
    };
    

    const convertNumberToWords = (num) => {
        const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        const tens = ["", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
        const scales = ["", "nghìn", "triệu", "tỷ"];
    
        if (num === 0) return "không đồng";
    
        const processChunk = (chunk) => {
            const hundreds = Math.floor(chunk / 100);
            const remainder = chunk % 100;
            const tensPart = Math.floor(remainder / 10);
            const unitsPart = remainder % 10;
    
            let chunkWords = "";
            if (hundreds > 0) {
                chunkWords += `${units[hundreds]} trăm `;
            }
            if (tensPart > 0) {
                chunkWords += `${tens[tensPart]} `;
            }
            if (unitsPart > 0) {
                chunkWords += `${units[unitsPart]}`;
            }
            if (tensPart === 0 && unitsPart > 0 && hundreds > 0) {
                chunkWords = `lẻ ${units[unitsPart]}`;
            }
    
            return chunkWords.trim();
        };
    
        let words = "";
        let scaleIndex = 0;
    
        while (num > 0) {
            const chunk = num % 1000;
            if (chunk > 0) {
                words = `${processChunk(chunk)} ${scales[scaleIndex]} ${words}`.trim();
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }
    
        return `${words} đồng`.trim();
    };
    


    // Cập nhật số tiền thành chữ khi amountPaid thay đổi
    useEffect(() => {
        setAmountInWords(convertNumberToWords(amountPaid));
    }, [amountPaid]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        setShowQRCode(e.target.value === 'transfer');
    };

    const handleDefaultAmountClick = (amount) => {
        setAmountPaid(amount);
    };

    // Hàm tăng số lượng sản phẩm
    const increaseQuantity = (key) => {
        setInvoiceDetails(invoiceDetails.map(product =>
            product.key === key
                ? { ...product, quantity: product.quantity + 1, totalPrice: product.unitPrice * (product.quantity + 1) }
                : product
        ));
    };

    // Hàm giảm số lượng sản phẩm
    const decreaseQuantity = (key) => {
        setInvoiceDetails(invoiceDetails.map(product =>
            product.key === key && product.quantity > 1
                ? { ...product, quantity: product.quantity - 1, totalPrice: product.unitPrice * (product.quantity - 1) }
                : product
        ));
    };

    const handleSaveInvoice = (values) => {
        if (editingInvoice) {
            setInvoices(invoices.map(invoice => invoice.key === editingInvoice.key
                ? { ...values, key: editingInvoice.key, status: paymentStatus }
                : invoice
            ));
            notification.success({ message: 'Hóa đơn đã được cập nhật!' });
        } else {
            const newInvoice = {
                ...values, key: invoices.length + 1, dateCreated: new Date().toLocaleString(), status: paymentStatus
            };
            setInvoices([...invoices, newInvoice]);
            notification.success({ message: 'Hóa đơn mới đã được tạo!' });
        }
        setIsModalVisible(false);
        form.resetFields();
        setEditingInvoice(null);
    };

    const handleDeleteInvoice = (key) => {
        setInvoices(invoices.filter(invoice => invoice.key !== key));
        notification.success({ message: 'Hóa đơn đã bị xóa!' });
    };

    const handleSaveProduct = (values) => {
        const totalPrice = values.quantity * values.unitPrice;
        if (editingProduct) {
            setInvoiceDetails(invoiceDetails.map(product =>
                product.key === editingProduct.key ? { ...values, totalPrice, key: editingProduct.key } : product
            ));
            notification.success({ message: 'Sản phẩm đã được cập nhật!' });
        } else {
            const newProduct = { ...values, key: invoiceDetails.length + 1, totalPrice };
            setInvoiceDetails([...invoiceDetails, newProduct]);
            notification.success({ message: 'Sản phẩm mới đã được thêm!' });
        }
        setIsProductModalVisible(false);
        productForm.resetFields();
        setEditingProduct(null);
    };

    const handleDeleteProduct = (key) => {
        setInvoiceDetails(invoiceDetails.filter(product => product.key !== key));
        notification.success({ message: 'Sản phẩm đã bị xóa!' });
    };

    const handleSelectProduct = (product) => {
        const newProduct = {
            key: invoiceDetails.length + 1, product: product.name, quantity: 1, unitPrice: product.price, totalPrice: product.price
        };
        setInvoiceDetails([...invoiceDetails, newProduct]);
        setIsProductSelectVisible(false);
    };

    const handlePayment = () => {
        if (amountPaid >= totalAmount) {
            setInvoices(invoices.map(invoice =>
                invoice.key === editingInvoice?.key ? { ...invoice, status: 'Đã thanh toán' } : invoice
            ));
            notification.success({ message: 'Thanh toán thành công!' });
            setPaymentStatus('Đã thanh toán');
        } else {
            notification.error({ message: 'Thanh toán không đủ!' });
            setPaymentStatus('Chờ thanh toán');
        }
    };

    const filteredInvoices = invoices.filter(
        invoice => invoice.code.toLowerCase().includes(searchText.toLowerCase()) ||
            invoice.customer.toLowerCase().includes(searchText.toLowerCase())
    );

    const columnsInvoices = [
        { title: 'Mã Hóa Đơn', dataIndex: 'code', key: 'code' },
        { title: 'Nhân Viên', dataIndex: 'staff', key: 'staff' },
        { title: 'Ngày Tạo', dataIndex: 'dateCreated', key: 'dateCreated' },
        { title: 'Khách Hàng', dataIndex: 'customer', key: 'customer' },
        { title: 'Loại Đơn', dataIndex: 'type', key: 'type' },
        {
            title: 'Trạng Thái', dataIndex: 'status', key: 'status',
            render: status => <Tag color={status === 'Đã thanh toán' ? 'green' : 'blue'}>{status}</Tag>
        },
        {
            title: 'Thao tác', key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => setEditingInvoice(record)}>Sửa</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteInvoice(record.key)} danger>Xóa</Button>
                </Space>
            )
        }
    ];

    const columnsProductDetails = [
        { title: 'STT', dataIndex: 'key', key: 'key' },
        { title: 'Ảnh', dataIndex: 'image', key: 'image', render: image => <img src={image} alt="Product" style={{ width: 50 }} /> },
        { title: 'Sản phẩm', dataIndex: 'product', key: 'product' },
        {
            title: 'Số lượng', dataIndex: 'quantity', key: 'quantity',
            render: (quantity, record) => (
                <Space>
                    <Button icon={<MinusOutlined />} onClick={() => decreaseQuantity(record.key)} />
                    {quantity}
                    <Button icon={<PlusOutlined />} onClick={() => increaseQuantity(record.key)} />
                </Space>
            )
        },
        { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', render: price => `${price.toLocaleString('vi-VN')} vnđ` },
        { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice', render: total => `${total.toLocaleString('vi-VN')} vnđ` },
        {
            title: 'Thao tác', key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => setEditingProduct(record)}>Sửa</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.key)} danger>Xóa</Button>
                </Space>
            )
        }
    ];

    return (
        
             <div className="counter-sale-container">
            <div className="invoice-section">
                <Input placeholder="Tìm kiếm hóa đơn..." value={searchText} onChange={e => setSearchText(e.target.value)} style={{ marginBottom: 20, width: 300 }} />
                <Button  icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Tạo hóa đơn mới</Button>
                <Table columns={columnsInvoices} dataSource={filteredInvoices} pagination={false} />
            </div>

            <div className="product-details-section">
                <Table columns={columnsProductDetails} dataSource={invoiceDetails} pagination={false} />
                <Button className="add-product-btn" onClick={() => setIsProductSelectVisible(true)}>Chọn sản phẩm</Button>
            </div>

            <Row gutter={20}>
                <Col span={12}>
                    <Card title="Thông tin khách hàng" className="info-card">
                        <Form layout="vertical">
                            <Form.Item label="Tên khách hàng"><Input value={selectedCustomer} readOnly /></Form.Item>
                            <Form.Item><Button onClick={() => setIsCustomerSelectVisible(true)}>Chọn khách hàng</Button></Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Dịch vụ khác" className="info-card">
                        <Form layout="vertical">
                            <Form.Item label="Dịch vụ giao hàng"><Switch checkedChildren="Có" unCheckedChildren="Không" /></Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

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
                            <>
                                <Form.Item label="Chọn số tiền">
                                    <Space>
                                        <Button onClick={() => handleDefaultAmountClick(100000)}>100.000 VND</Button>
                                        <Button onClick={() => handleDefaultAmountClick(200000)}>200.000 VND</Button>
                                        <Button onClick={() => handleDefaultAmountClick(500000)}>500.000 VND</Button>
                                        {/* <Button onClick={() => handleDefaultAmountClick(1000000)}>1.000.000 VND</Button>
                                        <Button onClick={() => handleDefaultAmountClick(2000000)}>2.000.000 VND</Button> */}
                                    </Space>
                                </Form.Item>

                                <Form.Item label="Số tiền khách trả">
                                    <Input type="number" value={amountPaid} onChange={e => setAmountPaid(Number(e.target.value))} />
                                </Form.Item>

                                <p>Thành chữ: {amountInWords}</p>
                            </>
                        )}
                        {showQRCode && (
                            <div className="qr-code-wrapper">
                                <Image className="image-qr" src={Anh1} alt="QR Code" width={200} height={200} />
                            </div>
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Thông Tin Hóa Đơn" className="info-card">
                        <Table columns={columnsProductDetails} dataSource={invoiceDetails} pagination={false} />
                        <Row>
                            <Col span={12}>Tổng tiền sản phẩm:</Col>
                            <Col span={12} style={{ textAlign: 'right' }}>{totalAmount.toLocaleString('vi-VN')} vnđ</Col>
                        </Row>
                        {paymentMethod === 'cash' && (
                            <Row>
                                <Col span={12}>Còn lại phải trả:</Col>
                                <Col span={12} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {(amountPaid - totalAmount).toLocaleString('vi-VN')} vnđ
                                </Col>
                            </Row>
                        )}
                        <Button block style={{ marginTop: 20 }} onClick={handlePayment}>Xác nhận thanh toán</Button>
                    </Card>
                </Col>
            </Row>

            {/* Các Modal */}
            <Modal title="Chọn sản phẩm" visible={isProductSelectVisible} onCancel={() => setIsProductSelectVisible(false)} footer={null}>
                <List dataSource={productList} renderItem={item => (
                    <List.Item><Button onClick={() => handleSelectProduct(item)}>{item.name} - {item.price.toLocaleString('vi-VN')} vnđ</Button></List.Item>
                )} />
            </Modal>

            <Modal title="Chọn khách hàng" visible={isCustomerSelectVisible} onCancel={() => setIsCustomerSelectVisible(false)} footer={null}>
                <Input.Search placeholder="Tìm kiếm theo tên hoặc số điện thoại" onSearch={value => console.log(value)} />
                <List dataSource={customerList} renderItem={item => (
                    <List.Item><Button onClick={() => setSelectedCustomer(item.name)}>{item.name} - {item.phone}</Button></List.Item>
                )} />
            </Modal>

            <Modal title={editingInvoice ? "Sửa hóa đơn" : "Thêm hóa đơn"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                <Form form={form} onFinish={handleSaveInvoice} layout="vertical">
                    <Form.Item name="code" label="Mã hóa đơn" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="staff" label="Nhân viên" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="customer" label="Khách hàng" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="type" label="Loại đơn" rules={[{ required: true }]}><Select><Option value="Tại quầy">Tại quầy</Option><Option value="Giao hàng">Giao hàng</Option></Select></Form.Item>
                    <Form.Item><Button htmlType="submit">Lưu</Button></Form.Item>
                </Form>
            </Modal>

            <Modal title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"} visible={isProductModalVisible} onCancel={() => setIsProductModalVisible(false)} footer={null}>
                <Form form={productForm} onFinish={handleSaveProduct} layout="vertical">
                    <Form.Item name="product" label="Sản phẩm" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}><Input type="number" /></Form.Item>
                    <Form.Item name="unitPrice" label="Đơn giá" rules={[{ required: true }]}><Input type="number" /></Form.Item>
                    <Form.Item><Button htmlType="submit">Lưu</Button></Form.Item>
                </Form>
            </Modal>
        </div>
       
    );
};

export default CounterSale;
