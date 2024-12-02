import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Select, Tag, Row, Col, Card, Modal, Form, notification, InputNumber, message, Image, List } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './InvoiceManagement.css';

const { Option } = Select;

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [productList, setProductList] = useState([]);
    const [isProductSelectVisible, setIsProductSelectVisible] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [form] = Form.useForm();

    // Lấy dữ liệu hóa đơn từ API
    const fetchInvoices = async () => {
        try {
            const response = await axios.get("https://localhost:7030/api/HoaDon"); // Thay đổi URL theo API của bạn
            const data = response.data;
            setInvoices(data || []);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu hóa đơn:", error);
            notification.error({ message: "Không thể lấy dữ liệu hóa đơn từ API." });
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleAddNew = () => {
        setEditingInvoice(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://localhost:7030/api/SanPham/GetAll');
                if (isMounted && response.data) {
                    const filteredData = response.data.flatMap(item =>
                        item.sanPhamChiTiets.map(chiTiet => ({
                            key: chiTiet.id,
                            id: item.id,
                            idSpct: chiTiet.id,
                            name: `${item.tenSp} - ${chiTiet.IdSizeNavigation?.TenSize || 'N/A'} - ${chiTiet.mauSac?.tenMauSac || 'N/A'}`,
                            price: item.giaBan,
                            image: item.imageDefaul,
                            soLuongTon: chiTiet.soLuongTon
                        }))
                    ).filter(product => product.soLuongTon > 0);
                    setProductList(filteredData);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching product data:", error);
                    message.error("Không thể tải dữ liệu sản phẩm.");
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);


    const handleSelectProduct = (product) => {
        const newProduct = {
            key: invoiceDetails.length + 1,
            id: product.id,
            idSpct: product.idSpct,
            product: product.name,
            quantity: 1,
            unitPrice: product.price,
            totalPrice: product.price
        };
        setInvoiceDetails([...invoiceDetails, newProduct]);
        setIsProductSelectVisible(false);
    };
    const handleSave = async (values) => {
        if (editingInvoice) {
            // Cập nhật hóa đơn
            const updatedInvoice = {
                ...editingInvoice,
                ...values
            };
            const response = await axios.put(`https://localhost:7030/api/HoaDon/${editingInvoice.id}`, updatedInvoice);
            setInvoices(invoices.map((invoice) =>
                invoice.id === editingInvoice.id ? updatedInvoice : invoice
            ));
            notification.success({ message: 'Hóa đơn đã được cập nhật!' });
        } else {
            // Thêm mới hóa đơn
            const newInvoice = {
                ...values,
                dateCreated: new Date().toISOString(),
            };
            const response = await axios.post("https://localhost:7030/api/HoaDon", newInvoice);
            setInvoices([...invoices, response.data]);
            notification.success({ message: 'Hóa đơn đã được thêm mới!' });
        }
        setIsModalVisible(false);
    };

    const handleEdit = async (record) => {
        try {
            const response = await axios.get(`https://localhost:7030/api/HoaDon/${record.id}`);
            
            if (!response || !response.data) {
                notification.error({ message: 'Không tìm thấy chi tiết hóa đơn' });
                return;
            }
    
            const invoiceData = response.data;
            
            const invoiceDetails = Array.isArray(invoiceData.hoaDonChiTiets) 
                ? invoiceData.hoaDonChiTiets.map((detail, index) => ({
                    key: index + 1,
                    id: invoiceData.id,
                    idSpct: detail.idSpct,
                    product: `Chi tiết sản phẩm: ${detail.idSpct}`,
                    quantity: detail.soLuong || 1,
                    unitPrice: detail.giaban || 0,
                    totalPrice: (detail.soLuong || 1) * (detail.giaban || 0)
                }))
                : [];
    
            const totalAmount = invoiceDetails.reduce((sum, item) => sum + item.totalPrice, 0);
    
            setInvoiceDetails(invoiceDetails);
            setEditingInvoice(invoiceData);
            form.setFieldsValue({
                tenNguoiNhan: invoiceData.tenNguoiNhan,
                sdtnguoiNhan: invoiceData.sdtnguoiNhan,
                diaChiNhanHang: invoiceData.diaChiNhanHang,
                trangThai: invoiceData.trangThai, // Correct way to set status
                tienKhachTra: totalAmount // Set total amount
            });
            setTotalAmount(totalAmount); // Update total amount state
            setIsModalVisible(true);
        } catch (error) {
            console.error("Lỗi lấy chi tiết hóa đơn:", error);
            notification.error({ message: 'Không thể tải chi tiết hóa đơn', description: error.message });
        }
    
             
    };

    const handleDelete = async (id) => {
        await axios.delete(`https://localhost:7030/api/HoaDon/${id}`);
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
        notification.success({ message: 'Hóa đơn đã bị xóa!' });
    };

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearchText =
            (invoice.maHoaDon && invoice.maHoaDon.toLowerCase().includes(searchText.toLowerCase())) ||
            (invoice.tenNguoiNhan && invoice.tenNguoiNhan.toLowerCase().includes(searchText.toLowerCase()));

        const matchesStatus =
            selectedStatus === 'all' || invoice.trangThai === selectedStatus;

        return matchesSearchText && matchesStatus;
    });

    const statusCounts = {
        1: invoices.filter((invoice) => invoice.trangThai === 1).length,
        2: invoices.filter((invoice) => invoice.trangThai === 2).length,
        3: invoices.filter((invoice) => invoice.trangThai === 3).length,
        4: invoices.filter((invoice) => invoice.trangThai === 4).length,
        5: invoices.filter((invoice) => invoice.trangThai === 5).length,
        6: invoices.filter((invoice) => invoice.trangThai === 6).length,
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'maHoaDon',
            key: 'maHoaDon',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tên người nhận',
            dataIndex: 'tenNguoiNhan',
            key: 'tenNguoiNhan',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdtnguoiNhan',
            key: 'sdtnguoiNhan',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'tienKhachTra',
            key: 'tienKhachTra',
            render: (total) => `${total?.toLocaleString('vi-VN')} vnđ`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (status) => {
                let color = 'green';
                switch (status) {
                    case 1:
                        color = 'volcano';
                        break;
                    case 2:
                        color = 'blue';
                        break;
                    case 3:
                        color = 'orange';
                        break;
                    case 4:  // Đang giao
                        color = 'yellow';
                        break;
                    case 5:
                        color = 'cyan';
                        break;
                    case 6:
                        color = 'red';
                        break;
                    default:
                        color = 'grey';
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
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>Xóa</Button>
                </Space>
            ),
        },
    ];

    const statusMapping = {
        1: "Chờ xác nhận",
        2: "Đã xác nhận",
        3: "Chờ giao",
        4: "Đang giao",
        5: "Hoàn thành",
        6: "Đơn hủy"
    };
    const columnsProductDetails = [
        { title: 'STT', dataIndex: 'key', key: 'stt' },
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
        {
            title: 'Đơn giá',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: price => `${price.toLocaleString('vi-VN')} vnđ`
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: total => `${total.toLocaleString('vi-VN')} vnđ`
        },
        {
            title: 'Thao tác', key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.key)} danger>Xóa</Button>
                </Space>
            )
        }
    ];
    // Đóng modal
    const closeProductModal = () => {
        setIsProductSelectVisible(false);
    };
    const handleDeleteProduct = (key) => {
        setInvoiceDetails(invoiceDetails.filter(product => product.key !== key));
        notification.success({ message: 'Sản phẩm đã bị xóa!' });
    };
    const increaseQuantity = (key) => {
        setInvoiceDetails(invoiceDetails.map(product =>
            product.key === key
                ? { ...product, quantity: product.quantity + 1, totalPrice: product.unitPrice * (product.quantity + 1) }
                : product
        ));
    };
    const decreaseQuantity = (key) => {
        setInvoiceDetails(invoiceDetails.map(product =>
            product.key === key && product.quantity > 1
                ? { ...product, quantity: product.quantity - 1, totalPrice: product.unitPrice * (product.quantity - 1) }
                : product
        ));
    };
    useEffect(() => {
        const total = invoiceDetails.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    }, [invoiceDetails]);
    return (
        <div className="invoice-management-container">
            <Row gutter={[16, 16]} className="status-cards" justify="center">
                {Object.keys(statusCounts).map(status => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={status}>
                        <Card
                            title={`${statusMapping[status] || "Không xác định"}`}
                            bordered={false}
                            className="status-card"
                        >
                            {statusCounts[status]}
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="filter-section">
                <Input
                    className="search-input"
                    placeholder="Tìm kiếm theo mã hoá đơn, tên người nhận..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                    className="status-select"
                    defaultValue="all"
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value)}
                >
                    <Option value="all">Tất cả các đơn</Option>
                    <Option value={1}>Chờ xác nhận</Option>
                    <Option value={2}>Đã xác nhận</Option>
                    <Option value={3}>Chờ giao</Option>
                    <Option value={4}>Đang giao</Option>
                    <Option value={5}>Hoàn thành</Option>
                    <Option value={6}>Đơn huỷ</Option>
                </Select>
                <Button
                    type="primary"
                    className="add-button"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                >
                    Tạo hoá đơn
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={filteredInvoices}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }} // Cuộn ngang nếu cần
            />

            <Modal
                title={editingInvoice ? 'Chỉnh sửa hóa đơn' : 'Thêm hóa đơn mới'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item label="Tên người nhận" name="tenNguoiNhan" rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại người nhận"
                        name="sdtnguoiNhan"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { len: 10, message: 'Số điện thoại phải có 10 chữ số!' } // Điều chỉnh theo yêu cầu của bạn
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Địa chỉ người nhận" name="diaChiNhanHang" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Trạng Thái" name="trangThai" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                        <Select>
                            <Option value={1}>Chờ xác nhận</Option>
                            <Option value={2}>Đã xác nhận</Option>
                            <Option value={3}>Chờ giao</Option>
                            <Option value={4}>Đang giao</Option>
                            <Option value={5}>Hoàn thành</Option>
                            <Option value={6}>Đơn hủy</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Tổng tiền"
                        name="tienKhachTra"
                        rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={totalAmount} // Gán giá trị của totalAmount vào đây
                            disabled // Không cho phép chỉnh sửa trực tiếp
                            formatter={value => `${value.toLocaleString()} VND`} // Định dạng số tiền
                        />

                    </Form.Item>
                    <div className="product-details-section">
                        <Table columns={columnsProductDetails} dataSource={invoiceDetails} pagination={false} />
                        <Button className="add-product-btn" onClick={() => setIsProductSelectVisible(true)}>Chọn sản phẩm</Button>

                    </div>
                    <Form.Item>z
                        <Button type="primary" htmlType="submit">
                            {editingInvoice ? 'Cập nhật hóa đơn' : 'Tạo hóa đơn'}
                        </Button>
                    </Form.Item>
                    <div>
                        <Modal
                            title="Chọn sản phẩm"
                            open={isProductSelectVisible}
                            onCancel={closeProductModal}
                            footer={null}
                        >
                            <List
                                dataSource={productList} // Dữ liệu sản phẩm từ API
                                renderItem={item => (
                                    <List.Item>
                                        <Image src={item.image} alt={item.name} width={50} style={{ marginRight: 10 }} />
                                        <Button onClick={() => handleSelectProduct(item)}>
                                            {item.name} - {item.price ? item.price.toLocaleString('vi-VN') : 'Liên hệ'} vnđ
                                        </Button>
                                    </List.Item>
                                )}
                            />
                        </Modal>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default InvoiceManagement;
