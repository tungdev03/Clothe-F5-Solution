import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Form, Select, Row, Col, Card, Tag, Modal, notification, Space, List, Radio, Switch, Image, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import './CounterSale.css';
import Anh1 from './Anh1.png';

const { Option } = Select;

const CounterSale = () => {
    // Định nghĩa hàm fetchInvoices ngoài useEffect

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('https://localhost:7030/api/HoaDon');
            if (!response.data) {
                throw new Error('Không có dữ liệu');
            }

            const data = response.data;
            // Log để kiểm tra dữ liệu
            console.log("Customer data:", data[0]?.idKhNavigation);
            console.log("Staff data:", data);
            const filteredData = data.map(item => ({
                key: item.id,
                code: item.maHoaDon,
                customer: item.idKhNavigation?.hoVaTenKh || 'Không có',
                dateCreated: item.ngayTao ? new Date(item.ngayTao).toLocaleString() : 'Chưa xác định',
                staff: item.idNvNavigation?.hoVaTenNv || 'Không có',
                type: item.loaiHoaDon,
                status: item.trangThai,
            }));
            setInvoices(filteredData);
            console.log(filteredData.staff)
        } catch (error) {
            console.error("Error fetching invoice data:", error);
            message.error("Không thể tải dữ liệu hóa đơn.");
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const [invoices, setInvoices] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [productForm] = Form.useForm();
    const [pageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isProductSelectVisible, setIsProductSelectVisible] = useState(false);
    const [isCustomerSelectVisible, setIsCustomerSelectVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('Chờ thanh toán');
    const [showQRCode, setShowQRCode] = useState(false);
    const [amountInWords, setAmountInWords] = useState("");

    const [productList, setProductList] = useState([]);
    const [cart, setCart] = useState([]);
    const showProductModal = () => {
        setIsProductSelectVisible(true);  // Mở modal chọn sản phẩm
    };
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);  // Lưu toàn bộ thông tin khách hàng vào state
        setIsCustomerSelectVisible(false);  // Đóng modal chọn khách hàng
        console.log(customer)
    };
    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };
    // Hàm lấy dữ liệu sản phẩm từ API
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
                            name: `${item.tenSp} - ${chiTiet.kichThuoc?.tenSize || 'N/A'} - ${chiTiet.mauSac?.tenMauSac || 'N/A'}`,
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

    const [customerList, setCustomerList] = useState([]);
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('https://localhost:7030/api/KhachHang');
                const data = response.data;
                const filteredData = data.map(item => ({
                    key: item.id,
                    name: item.hoVaTenKh,
                    phone: item.soDienThoai,
                }));
                setCustomerList(filteredData);
            } catch (error) {
                console.error("Error fetching customer data:", error);
                message.error("Không thể tải dữ liệu khách hàng.");
            }
        };
        fetchCustomers();
    }, []);


    useEffect(() => {
        const total = invoiceDetails.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    }, [invoiceDetails]);

    // Hàm chuyển đổi số thành chữ (tiếng Việt)
    const convertNumberToWords = (num) => {
        const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        const tens = ["", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
        const scales = ["", "nghìn", "triệu", "tỷ"];

        if (num === 0) return "không đồng";

        let words = "";
        let scaleIndex = 0;

        while (num > 0) {
            let part = num % 1000;
            if (part > 0) {
                let partWords = "";

                // Xử lý hàng trăm
                const hundreds = Math.floor(part / 100);
                const remainder = part % 100;
                if (hundreds > 0) {
                    partWords += `${units[hundreds]} trăm`;
                }

                // Xử lý hàng chục và đơn vị
                if (remainder > 0) {
                    if (remainder < 10) {
                        partWords += `lẻ ${units[remainder]}`;
                    } else {
                        const tensPart = Math.floor(remainder / 10);
                        const unitsPart = remainder % 10;
                        partWords += `${tens[tensPart]} ${units[unitsPart]}`.trim();
                    }
                }

                words = `${partWords} ${scales[scaleIndex]} ${words}`.trim();
            }

            num = Math.floor(num / 1000);
            scaleIndex++;
        }

        return words + " đồng";
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

    const handleDeleteInvoice = async (key) => {
        try {
            await axios.delete(`https://localhost:7030/api/HoaDon/${key}`);
            setInvoices(invoices.filter(invoice => invoice.key !== key));
            notification.success({ message: 'Hóa đơn đã bị xóa!' });

        } catch (error) {
            notification.error({ message: 'Xóa hóa đơn không thành công!' });
        }

    };
    const handleDeleteProduct = (key) => {
        setInvoiceDetails(invoiceDetails.filter(product => product.key !== key));
        notification.success({ message: 'Sản phẩm đã bị xóa!' });
    };

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

    const [customerFormData, setCustomerFormData] = useState(null); // Dữ liệu khách hàng
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // Phương thức thanh toán
    const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách sản phẩm
    const [notes, setNotes] = useState(''); // Ghi chú

    const handlePayment = async () => {
        if (isNaN(amountPaid) || amountPaid <= 0) {
            notification.error({ message: 'Số tiền thanh toán không hợp lệ!' });
            return;
        }
        if (!selectedCustomer) {
            notification.error({ message: 'Vui lòng chọn khách hàng trước khi thanh toán!' });
            return;
        }

        if (invoiceDetails.length === 0) {
            notification.error({ message: 'Vui lòng chọn sản phẩm trước khi thanh toán!' });
            return;
        }
        if (!invoiceDetails.every(detail => detail.id && detail.quantity > 0 && detail.unitPrice > 0)) {
            notification.error({ message: 'Dữ liệu sản phẩm không hợp lệ!' });
            return;
        }

        if (amountPaid >= totalAmount) {
            try {
                const dataString = localStorage.getItem("user");
                let IdNhanVien = null;

                if (dataString) {
                    try {
                        const parsedData = JSON.parse(dataString);
                        if (parsedData && parsedData.IdNhanVien) {
                            IdNhanVien = parsedData.IdNhanVien;
                        } else {
                            console.error("Không tìm thấy id nhân viên trong dữ liệu! vui lòng đăng nhập");
                        }
                    } catch (error) {
                        console.error("Lỗi khi phân tích dữ liệu JSON!", error);
                    }
                } else {
                    console.error("Không tìm thấy dữ liệu trong localStorage!");
                    return;
                }
                console.log("Kiểu dữ liệu của IDNhanvien:", IdNhanVien);

                // Dữ liệu cần gửi tới API
                const invoiceData = {
                    idKh: selectedCustomer.key,
                    idNv: IdNhanVien || null, // Thay thế bằng ID nhân viên thực tế
                    loaiHoaDon: 1, // Hóa đơn tại quầy
                    trangThai: 1,
                    hoaDonChiTiets: invoiceDetails.map(detail => ({
                        idSpct: detail.idSpct, // Sử dụng idSpct thay vì productId
                        soLuong: detail.quantity,
                        donGia: detail.unitPrice,
                        trangThai: 1
                    })),
                    ghiChu: notes || "",
                    thanhTien: totalAmount,
                    giaTriGiam: 0, // Nếu có áp dụng giảm giá
                    tienKhachDua: amountPaid,
                    tienThua: amountPaid - totalAmount,
                    hinhThucThanhToan: paymentMethod === 'cash' ? 1 : 2
                };


                // Gọi API thêm hóa đơn
                const response = await axios.post('https://localhost:7030/api/HoaDon', invoiceData);
                // Kiểm tra nếu trả về status 201 thì là thành công
                if (response.status === 201) {
                    notification.success({ message: 'Thanh toán thành công!' });
                    setInvoices([...invoices, response.data]);
                    setPaymentStatus('Đã thanh toán');
                    // Reset form sau khi thanh toán thành công
                    setSelectedCustomer(null);
                    setInvoiceDetails([]);
                    setAmountPaid(0);
                    setPaymentMethod('cash');
                    setNotes('');
                    await fetchInvoices();
                }
            } catch (error) {
                console.error('Lỗi khi thêm hóa đơn:', error);
                notification.error({
                    message: 'Đã xảy ra lỗi khi thanh toán! vui lòng đăng nhập bẳng tài khoản nhân viên',
                    description: error.response ? error.response.data.message : 'Vui lòng thử lại sau',
                });
                return;

            }
        } else {
            notification.error({ message: 'Số tiền thanh toán không đủ!' });
            setPaymentStatus('Chờ thanh toán');
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        // Kiểm tra nếu invoice là null hoặc undefined
        if (!invoice) return false;

        const searchTextLower = searchText.toLowerCase();

        // Kiểm tra code
        const codeMatch = invoice.code ?
            invoice.code.toLowerCase().includes(searchTextLower) :
            false;

        // Kiểm tra customer
        const customerMatch = invoice.customer ?
            invoice.customer.toLowerCase().includes(searchTextLower) :
            false;

        return codeMatch || customerMatch;
    });

    const columnsInvoices = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 70,
        },
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
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteInvoice(record.key)} danger>Xóa</Button>
                </Space>
            )
        }
    ];


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
    return (

        <div className="counter-sale-container">
            <div className="invoice-section">
                <Input placeholder="Tìm kiếm hóa đơn..." value={searchText} onChange={e => setSearchText(e.target.value)} style={{ marginBottom: 20, width: 300 }} />
                <Button icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Tạo hóa đơn mới</Button>
                <Table columns={columnsInvoices} dataSource={filteredInvoices} pagination={{
                    current: currentPage,
                    pageSize,
                    total: invoices.length,
                    onChange: handleTableChange,
                }} />
            </div>

            <div className="product-details-section">
                <Table columns={columnsProductDetails} dataSource={invoiceDetails} pagination={false} />
                <Button className="add-product-btn" onClick={() => setIsProductSelectVisible(true)}>Chọn sản phẩm</Button>
            </div>

            <Row gutter={20}>
                <Col span={12}>
                    <Card title="Thông tin khách hàng" className="info-card">
                        <Form layout="vertical">
                            <Form.Item label="Tên khách hàng">
                                <Input value={selectedCustomer ? selectedCustomer.name : ''} readOnly />
                            </Form.Item>
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
            <div style={{ padding: '20px' }}>



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

            <Modal
                title="Chọn khách hàng"
                open={isCustomerSelectVisible}
                onCancel={() => setIsCustomerSelectVisible(false)}
                footer={null}
            >
                <Input.Search
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                    onSearch={value => console.log(value)}
                />
                <List
                    dataSource={customerList}
                    renderItem={item => (
                        <List.Item>
                            <Button onClick={() => handleSelectCustomer(item)}>
                                {item.name} - {item.phone}
                            </Button>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>

    );
};

export default CounterSale;