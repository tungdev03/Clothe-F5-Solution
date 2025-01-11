import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, LogoutOutlined, DeleteTwoTone } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input, Table, Row, Col, message, Spin, InputNumber } from 'antd';
import logo_v1 from '../../../assets/images/Logo.png';
import CustomHeader from "../../Layouts/Header/Header";  // Import CustomHeader
import GioHangService from '../../../Service/GiohangService';
import './Home.css';

const { Content } = Layout;

const Cart = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUsername(user.TaiKhoan);
                setUserId(user.IdKhachhang);
                fetchCartData(user.IdKhachhang);
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                setIsFetching(false);
                console.log(userId)
            }
        }
    }, []);

    const fetchCartData = async (userId) => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await GioHangService.getAllGioHang(userId);

            setCartItems(data);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
            message.error("Không thể tải giỏ hàng");
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUsername(null);
        navigate('/');
    };

    const handleContinueShopping = () => {
        setLoading(true);
        setTimeout(() => navigate('/'), 2000);
    };

    const handleDelete = async (id) => {
        try {
            await GioHangService.deleteGioHang(id);
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
            message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
        } catch (error) {
            console.error("Error deleting cart item:", error);
            message.error("Xóa sản phẩm thất bại");
        }
    };

    const handleClickViewOder = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success('Đang chuyển đến trang thông tin đơn hàng');
            const orderId = userId
            navigate(`/order/${orderId}`);
        }, 1000);
    };
    const handleQuantityChange = async (value, record) => {
        if (value <= 0) {
            message.error("Số lượng phải lớn hơn 0");
            return;
        }
        try {
            // Tạo đối tượng cập nhật
            const updatedItem = { ...record, soLuong: value };
            await GioHangService.updateGioHang(record.id, value);

            // Cập nhật lại danh sách giỏ hàng
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === record.id
                        ? { ...item, soLuong: value, tongTien: value * item.donGia } // Cập nhật số lượng và tổng tiền
                        : item
                )
            );
            message.success("Cập nhật số lượng thành công");
        } catch (error) {
            console.error("Error updating cart item:", error);
            message.error(error.response?.data?.Message || "Cập nhật số lượng thất bại");
        }
    };

    const columns = [
        {
            title: 'Hình Ảnh',
            dataIndex: 'hinhAnh',
            render: (text) => <img src={text} alt="product" style={{ width: 50, height: 50 }} />,
            align: 'center',
        },
        { title: 'Tên Sản Phẩm', dataIndex: 'tenSp', align: 'center' },
        { title: 'Màu Sắc', dataIndex: 'tenMauSac', align: 'center' },
        { title: 'Kích Cỡ', dataIndex: 'tenSize', align: 'center' },
        {
            title: "Số Lượng",
            dataIndex: "soLuong",
            align: 'center',
            render: (text, record) => (
                <InputNumber
                    min={1}
                    value={text}
                    onChange={(value) => handleQuantityChange(value, record)}
                    style={{ width: '120px', textAlign: 'center' }}
                    size="small"
                />
            ),
        },
        { title: 'Giá', dataIndex: 'donGia', render: (text) => `${text.toLocaleString()} VNĐ`, align: 'center' },
        { title: 'Tổng Tiền', dataIndex: 'tongTien', render: (text) => `${text.toLocaleString()} VNĐ`, align: 'center' },
        {
            title: '',
            render: (_, record) => (
                <Button type="danger" onClick={() => handleDelete(record.id)}>
                    <DeleteTwoTone />
                </Button>
            ),
            align: 'center',
        },
    ];

    const handleCheckoutClick = () => {
        if (cartItems.length === 0) {
            message.warning("Giỏ hàng của bạn hiện tại không có sản phẩm để thanh toán. Bạn vui lòng chọn Sản Phẩm vào giỏ hàng !");
        } else {
            navigate('/checkout');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <CustomHeader username={username} handleLogout={handleLogout} />
            <Content style={{ margin: '0 10%', background: '#fff', borderRadius: '4px' }}>
                {/* Show this message if cart is empty */}
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <h2>Giỏ hàng hiện tại trống.</h2>
                    </div>
                ) : (
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={5} style={{ textAlign: 'right' }}><strong>Tổng Tiền:</strong></Table.Summary.Cell>
                                <Table.Summary.Cell colSpan={2}><strong>{cartItems.reduce((sum, item) => sum + item.tongTien, 0).toLocaleString()} VNĐ</strong></Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                )}

                <Row justify="end" style={{ marginBottom: '20px' }}>
                    <Col>
                        <Button
                            type="primary"
                            onClick={handleClickViewOder}
                            style={{ backgroundColor: 'green', borderColor: 'black', height: '50px', width: '200px', marginRight: '10px' }}
                            disabled={loading}
                        >
                            {loading ? <Spin size="small" /> : 'Xem thông tin đơn hàng'}
                        </Button>
                    </Col>
                </Row>

                <Row justify="end" style={{ marginBottom: '20px' }}>
                    <Col>
                        <Button type="primary" onClick={handleContinueShopping} style={{ backgroundColor: 'black', borderColor: 'black', height: '50px', width: '200px' }} disabled={loading}>
                            {loading ? <Spin size="small" /> : 'Tiếp tục mua sắm'}
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={handleCheckoutClick} style={{ height: '50px', width: '200px' }} disabled={loading}>
                            {loading ? <Spin size="small" /> : 'Thanh toán'}
                        </Button>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Cart;
