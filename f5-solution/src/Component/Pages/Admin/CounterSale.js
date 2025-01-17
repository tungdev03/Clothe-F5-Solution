import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Form, Select, Row, Col, Card, Tag, Modal, notification, Space, List, Radio, Switch, Image, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import './CounterSale.css';
import Anh1 from './Anh1.png';
import AdminService from '../../../Service/AdminService';
import AuthService from '../../../Service/AuthService';

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

            const filteredData = data.map(item => ({
                key: item.id,
                code: item.maHoaDon,
                customer: item.idKhNavigation?.hoVaTenKh || 'hệ thống',
                dateCreated: item.ngayTao ? new Date(item.ngayTao).toLocaleString() : 'Chưa xác định',
                staff: item.idNvNavigation?.HoVaTenNv || 'Không có',
                TenNguoiNhan: item.TenNguoiNhan,
                type: item.loaiHoaDon,
                status: item.trangThai,
            }));
            const sortedData = filteredData.sort((a, b) => {
                return Date.parse(b.dateCreated) - Date.parse(a.dateCreated);
            });
            setInvoices(sortedData);
        } catch (error) {
            console.error("Error fetching invoice data:", error);
            message.error("Không thể tải dữ liệu hóa đơn.");
        }
    };


    const [invoices, setInvoices] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
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
    const [searchCustomerText, setSearchCustomerText] = useState("");
    const [productList, setProductList] = useState([]);
    const [cart, setCart] = useState([]);
    const showProductModal = () => {
        setIsProductSelectVisible(true);  // Mở modal chọn sản phẩm
    };
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);  // Lưu toàn bộ thông tin khách hàng vào state
        setIsCustomerSelectVisible(false);  // Đóng modal chọn khách hàng
    };

    const handleModalClose = () => {
        setIsModalVisible(false); // Đặt trạng thái Modal về `false` để đóng Modal
    };

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const newCustomer = {
                maKh: values.maKh,
                hoVaTenKh: values.hoVaTenKh,
                gioiTinh: values.gioiTinh === 'Nam', // Chuyển đổi giới tính thành boolean
                ngaySinh: values.ngaySinh,
                taiKhoan: values.taiKhoan || 'string', // Giá trị mặc định
                matKhau: values.matKhau || 'string', // Giá trị mặc định
                soDienThoai: values.soDienThoai,
                email: values.email,
                trangThai: 0, // Trạng thái mặc định là 0
            };
            await AuthService.registerCustomer(newCustomer); // Ensure this is awaited
            message.success("Thêm mới khách hàng thành công");
            handleModalClose();
            form.resetFields();
            await fetchCustomers();

        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Hàm lấy dữ liệu sản phẩm từ API
    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://localhost:7030/api/SanPham/GetAll');
                console.log(response.data);
                if (isMounted && response.data) {
                    const filteredData = response.data.flatMap(item =>
                        item.sanPhamChiTiets.map(chiTiet => ({
                            key: chiTiet.id,
                            id: item.id,
                            idSpct: chiTiet.id,
                            name: `${item.tenSp} - ${'size ' + chiTiet.size?.tenSize || 'Chưa có kích thước'} - ${chiTiet.mauSac?.tenMauSac || 'Chưa có màu'}`,
                            price: item.giaBan,
                            image: item.imageDefaul,
                            soLuongTon: chiTiet.soLuongTon,
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
    useEffect(() => {
        fetchCustomers();
        fetchInvoices();
    }, []);


    useEffect(() => {
        const total = invoiceDetails.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    }, [invoiceDetails]);

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

    // const handleDeleteInvoice = async (key) => {
    //     try {
    //         await axios.delete(`https://localhost:7030/api/HoaDon/${key}`);
    //         setInvoices(invoices.filter(invoice => invoice.key !== key));
    //         notification.success({ message: 'Hóa đơn đã bị xóa!' });

    //     } catch (error) {
    //         notification.error({ message: 'Xóa hóa đơn không thành công!' });
    //     }

    // };
    const handleDeleteProduct = (key) => {
        setInvoiceDetails(invoiceDetails.filter(product => product.key !== key));
        notification.success({ message: 'Sản phẩm đã bị xóa!' });
    };

    const handleSelectProduct = (product) => {
        // Kiểm tra xem sản phẩm đã tồn tại trong invoiceDetails chưa
        const existingProductIndex = invoiceDetails.findIndex(detail =>
            detail.idSpct === product.idSpct // So sánh theo idSpct (kích thước)
        );

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            const updatedProduct = {
                ...invoiceDetails[existingProductIndex],
                quantity: invoiceDetails[existingProductIndex].quantity + 1,
                totalPrice: (invoiceDetails[existingProductIndex].unitPrice * (invoiceDetails[existingProductIndex].quantity + 1)),
            };

            const updatedInvoiceDetails = [...invoiceDetails];
            updatedInvoiceDetails[existingProductIndex] = updatedProduct; // Cập nhật sản phẩm trong danh sách

            setInvoiceDetails(updatedInvoiceDetails); // Cập nhật state
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới
            const newProduct = {
                key: invoiceDetails.length + 1,
                id: product.id,
                idSpct: product.idSpct,
                product: product.name,
                image: product.image,
                quantity: 1,
                unitPrice: product.price,
                totalPrice: product.price,
            };
            setInvoiceDetails([...invoiceDetails, newProduct]); // Thêm sản phẩm mới
        }

        setIsProductSelectVisible(false);
    };
    const [searchProductText, setSearchProductText] = useState("");
    const filteredProductList = productList.filter(product =>
        product.name.toLowerCase().includes(searchProductText.toLowerCase())
    );
    const filteredCustomerList = customerList.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(searchCustomerText.toLowerCase())) ||
        (customer.phone && customer.phone.includes(searchCustomerText))
    );

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

                const invoiceData = {
                    idKh: selectedCustomer.key,
                    idNv: IdNhanVien || null,
                    TenNguoiNhan: selectedCustomer ? selectedCustomer.name : '',
                    SdtnguoiNhan: selectedCustomer.phone,
                    TienKhachTra: amountPaid,
                    loaiHoaDon: 1,
                    trangThai: 5,
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
                if (response.status === 200) {
                    notification.success({
                        message: 'Thanh toán thành công!',
                        description: 'Hóa đơn đã được tạo thành công.',
                        duration: 3 // Hiển thị thông báo trong 3 giây
                    });

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
        { title: 'Mã Hóa Đơn', dataIndex: 'code', key: 'code', align: "center", },
        // { title: 'Nhân Viên', dataIndex: 'staff', key: 'staff', align: "center", },
        { title: 'Ngày Tạo', dataIndex: 'dateCreated', key: 'dateCreated', align: "center", },
        {
            title: 'Khách Hàng', dataIndex: 'customer', key: 'customer', align: "center", render: (customer, record) => {
                return customer ? customer : record.TenNguoiNhan;
            },
        },
        {
            title: 'Loại Đơn', dataIndex: 'type', key: 'type',
            render: (type) => {
                let color = 'green';
                switch (type) {
                    case 1:
                        color = 'blue';
                        break;
                    case 2:
                        color = 'red';
                        break;
                    default:
                        color = 'grey';
                }
                const typeText = loaiDon[type] || "Không xác định";
                return <Tag color={color}>{typeText}</Tag>;
            },
            align: "center",
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'green';
                switch (status) {
                    case 1:
                        color = 'red';
                        break;
                    case 2:
                        color = 'blue';
                        break;
                    case 3:
                        color = 'orange';
                        break;
                    case 4:
                        color = 'cyan';
                        break;
                    case 5:
                        color = 'green';
                        break;
                    case 6:
                        color = 'yellow';
                        break;
                    default:
                        color = 'grey';
                }
                const statusText = statusMapping[status] || "Không xác định";
                return <Tag color={color}>{statusText}</Tag>;
            },
            align: "center",
        },
        // {
        //     title: 'Thao tác', key: 'action',
        //     render: (text, record) => (
        //         <Space size="middle">
        //             <Button icon={<DeleteOutlined />} onClick={() => handleDeleteInvoice(record.key)} danger>Xóa</Button>
        //         </Space>
        //     ),
        //     align: "center",
        // }
    ];
    const statusMapping = {
        1: "Chờ xác nhận",
        2: "Đã xác nhận",
        3: "Chờ giao",
        4: "Đang giao",
        5: "Hoàn thành",
        6: "Đơn hủy"
    };
    const loaiDon = {
        1: "Tại quầy",
        2: "Online"
    };

    const columnsProductDetails = [
        { title: 'STT', dataIndex: 'key', key: 'stt', align: "center", },
        { title: 'Ảnh', dataIndex: 'image', key: 'image', render: image => <img src={image} alt="Product" style={{ width: 50 }} />, align: "center", },
        { title: 'Sản phẩm', dataIndex: 'product', key: 'product', align: "center", },
        {
            title: 'Số lượng', dataIndex: 'quantity', key: 'quantity',
            render: (quantity, record) => (
                <Space>
                    <Button icon={<MinusOutlined />} onClick={() => decreaseQuantity(record.key)} />
                    {quantity}
                    <Button icon={<PlusOutlined />} onClick={() => increaseQuantity(record.key)} />
                </Space>
            ), align: "center",
        },
        {
            title: 'Đơn giá',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: price => `${price.toLocaleString('vi-VN')} vnđ`,
            align: "center",
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: total => `${total.toLocaleString('vi-VN')} vnđ`,
            align: "center",
        },
        {
            title: 'Thao tác', key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.key)} danger>Xóa</Button>
                </Space>
            ),
            align: "center",
        }
    ];
    // Đóng modal
    const closeProductModal = () => {
        setIsProductSelectVisible(false);
    };

    const handleModalOpen = () => {
        setIsModalVisible(true); // Đặt trạng thái Modal về `true` để mở Modal
    };
    return (

        <div className="counter-sale-container">
            <div className="invoice-section">
                <Input placeholder="Tìm kiếm hóa đơn..." value={searchText} onChange={e => setSearchText(e.target.value)} style={{ marginBottom: 20, width: 300 }} />
                <Table columns={columnsInvoices} dataSource={filteredInvoices} pagination={false} // Tắt phân trang
                    scroll={{
                        y: 300,
                    }}
                    style={{ overflowX: "hidden" }} // Ẩn cuộn ngang
                />
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
                            <div style={{ display: "flex" }}>
                                <Form.Item><Button onClick={() => setIsCustomerSelectVisible(true)}>Chọn khách hàng</Button></Form.Item>
                                <Form.Item><Button onClick={handleModalOpen}>Thêm khách hàng mới</Button></Form.Item>
                            </div>
                        </Form>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Dịch vụ khác" className="info-card">
                        {/* <Form layout="vertical">
                            <Form.Item label="Dịch vụ giao hàng"><Switch checkedChildren="Có" unCheckedChildren="Không" /></Form.Item>
                        </Form> */}
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

                                <Form.Item
                                    label="Số tiền khách trả"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số tiền khách trả!' },
                                        { type: 'number', message: 'Số tiền phải là một số!' },
                                        { max: 10000000000, message: 'Số tiền không được vượt quá 10 tỷ VNĐ!' },
                                        {
                                            validator: (_, value) => {
                                                if (value && value < 0) {
                                                    return Promise.reject(new Error('Số tiền không được âm!'));
                                                }
                                                return Promise.resolve();
                                            }
                                        },
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        value={amountPaid}
                                        onChange={e => {
                                            const value = Number(e.target.value);
                                            // Chỉ cập nhật giá trị nếu nó nhỏ hơn hoặc bằng 10 tỷ
                                            if (value <= 10000000000) {
                                                setAmountPaid(value);
                                            }
                                        }}
                                        placeholder="Nhập số tiền khách trả"
                                    />
                                </Form.Item>
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
                    width={1000}
                >
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchProductText}
                        onChange={e => setSearchProductText(e.target.value)} // Cập nhật trạng thái tìm kiếm
                        style={{ marginBottom: 20 }}
                    />
                    <List
                        dataSource={filteredProductList} // Dữ liệu sản phẩm đã lọc
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
                    onSearch={value => setSearchCustomerText(value)} // Cập nhật trạng thái tìm kiếm
                    enterButton
                    style={{ marginBottom: 20 }}
                />
                <List
                    dataSource={filteredCustomerList} // Sử dụng danh sách đã lọc
                    renderItem={item => (
                        <List.Item>
                            <Button onClick={() => handleSelectCustomer(item)}>
                                {item.name} - {item.phone}
                            </Button>
                        </List.Item>
                    )}
                />
            </Modal>

            <Modal
                title="Thêm khách hàng"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={720}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>


                    <Form.Item
                        name="hoVaTenKh"
                        label="Họ và Tên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên!' },
                            {
                                pattern: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÊÔêôơƯÁÉÍÓÚÝáéíóúýĂÂÊÔƯàáầấẩẫậèéềếểễệìíòóồốổỗộùúừứửữựỳýỷỹđịạọụờăưễảứ\s]+$/,
                                message: 'Tên không được chứa số hoặc ký tự đặc biệt'
                            }
                        ]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        name="gioiTinh"
                        label="Giới Tính"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ngaySinh"
                        label="Ngày Sinh"
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày sinh!' },
                            {
                                validator: (_, value) => {
                                    if (value) {
                                        const today = new Date();
                                        const birthDate = new Date(value);
                                        if (birthDate > today) {
                                            return Promise.reject(new Error('Ngày sinh không được lớn hơn ngày hiện tại!'));
                                        }
                                        return Promise.resolve();
                                    }
                                    return Promise.resolve();
                                }
                            },
                        ]}
                    >
                        <Input type="date" placeholder="Chọn ngày sinh" />
                    </Form.Item>

                    <Form.Item
                        name="soDienThoai"
                        label="Số Điện Thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { len: 10, message: 'Số điện thoại phải có 10 chữ số!' },
                            { max: 10, message: 'Số điện thoại không được quá 10 ký tự!' },
                            { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa số!' }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input type="email" placeholder="Nhập email" />
                    </Form.Item>

                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={handleModalClose} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Thêm mới
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>

    );
};

export default CounterSale;