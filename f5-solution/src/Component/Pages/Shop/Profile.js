import React, { useState, useEffect } from 'react';
import { UserOutlined, ShoppingCartOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input, Row, Col, Card, Avatar, Form, Radio, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo_v1 from '../../../assets/images/Logo.png';
import './Home.css';
import { Content } from 'antd/es/layout/layout';
const { Header } = Layout;

const items1 = [
    { key: '/', label: 'Cửa hàng' },
    { key: '/Products', label: 'Sản phẩm' },
    { key: '/contact', label: 'Liên hệ' },
    { key: '/album', label: 'Bộ sưu tập' }
];

const Profile = () => {
    const navigate = useNavigate();
    const [TaiKhoan, setUsername] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        TaiKhoan: null,
        fullName: '',
        email: '',
        dob: '',
        phone: '',
        gender: '',
        avatarUrl: ''
    });
    const [addresses, setAddresses] = useState([]); // State để quản lý danh sách địa chỉ
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserProfile({
                username: user.TaiKhoan,
                fullName: user.fullName || 'Nguyen Van A',
                email: user.email || 'example@example.com',
                dob: user.dob || '01/01/1990',
                phone: user.phone || '0123456789',
                gender: user.gender || 'Nam',
                avatarUrl: user.avatarUrl || 'https://www.w3schools.com/howto/img_avatar.png'
            });
            setAddresses(user.addresses || []); // Load danh sách địa chỉ từ localStorage
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUsername(user.TaiKhoan);
            }
        }
    }, []);
    const userMenu = (
        <Menu>
            <Menu.Item key="1" onClick={() => navigate('/profile')}>
                Thông tin cá nhân
            </Menu.Item>
            <Menu.Item key="2" danger onClick={() => { localStorage.removeItem('user'); setUsername(null); navigate('/'); }}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile({
            ...userProfile,
            [name]: value
        });
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        const updatedUser = { ...userProfile, addresses };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toggleEditMode();
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setIsAddressModalVisible(true);
    };

    const handleEditAddress = (index) => {
        setEditingAddress({ index, ...addresses[index] });
        setIsAddressModalVisible(true);
    };

    const handleDeleteAddress = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
    };

    const handleAddressModalOk = () => {
        if (editingAddress) {
            const updatedAddresses = [...addresses];
            updatedAddresses[editingAddress.index] = editingAddress;
            setAddresses(updatedAddresses);
        } else {
            setAddresses([...addresses, editingAddress]);
        }
        setIsAddressModalVisible(false);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEditingAddress({ ...editingAddress, [name]: value });
    };

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    padding: '20px 40px',
                    height: '120px',
                }}
            >
                <div className="logo-brand" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo_v1} alt="logo" style={{ height: '150px', marginRight: '3px' }} />
                    <span className="brand" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        <h2><span style={{ color: 'orange' }}>F5</span> Fashion</h2>
                    </span>
                </div>

                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={[items1]}
                    onClick={(e) => navigate(e.key)}
                    items={items1}
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                />
                <div>
                    <Input placeholder="Search" />
                </div>

                <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button type="link" icon={<ShoppingCartOutlined />} style={{ fontSize: '16px' }}>Giỏ hàng</Button>
                    {TaiKhoan ? (
                        <Dropdown overlay={userMenu} placement="bottomRight">
                            <Button type="link">
                                <Space>
                                    <span style={{ fontSize: '16px' }}>Xin chào, {TaiKhoan}</span>
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button type="link" icon={<UserOutlined />} style={{ fontSize: '16px' }} onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </Header>
            <Content
                style={{
                    margin: '0 10%',
                    minHeight: '100%',
                    background: '#fff',
                    borderRadius: '4px',
                }}
            >
                <h1 style={{ marginTop: '24px', textAlign: 'center' }}>THÔNG TIN NGƯỜI DÙNG</h1>
                <Card style={{ maxWidth: '90%', margin: '20px auto', padding: '20px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={6} style={{ textAlign: 'center' }}>
                            <Avatar size={120} src={userProfile.avatarUrl} />
                        </Col>
                        <Col span={18}>
                            <Form layout="vertical">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Tên người dùng">
                                            <Input name="username" value={userProfile.TaiKhoan} disabled />
                                        </Form.Item>
                                        <Form.Item label="Họ và tên">
                                            <Input name="fullName" value={userProfile.fullName} onChange={handleInputChange} disabled={!isEditing} />
                                        </Form.Item>
                                        <Form.Item label="Email">
                                            <Input name="email" value={userProfile.email} onChange={handleInputChange} disabled={!isEditing} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Ngày sinh">
                                            <Input name="dob" value={userProfile.dob} onChange={handleInputChange} disabled={!isEditing} />
                                        </Form.Item>
                                        <Form.Item label="Số điện thoại">
                                            <Input name="phone" value={userProfile.phone} onChange={handleInputChange} disabled={!isEditing} />
                                        </Form.Item>
                                        <Form.Item label="Giới tính">
                                            <Radio.Group name="gender" value={userProfile.gender} onChange={handleInputChange} disabled={!isEditing}>
                                                <Radio value="Nam">Nam</Radio>
                                                <Radio value="Nữ">Nữ</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        {isEditing ? (
                            <Button type="primary" onClick={handleSave}>Cập nhật</Button>
                        ) : (
                            <Button color="default" variant="solid" onClick={toggleEditMode}>Chỉnh sửa</Button>
                        )}
                    </div>
                </Card>

                {/* CRUD Address Section */}
                <h2 style={{ marginTop: '24px', textAlign: 'center' }}>ĐỊA CHỈ NGƯỜI DÙNG</h2>
                <Card style={{ maxWidth: '90%', margin: '20px auto', padding: '20px' }}>
                    <Button type="primary" onClick={handleAddAddress} style={{ marginBottom: '20px' }}>Thêm địa chỉ mới</Button>
                    {addresses.map((address, index) => (
                        <Card key={index} style={{ marginBottom: '10px' }}>
                            <Row>
                                <Col span={20}>
                                    <p>{address.fullName} - {address.phone}</p>
                                    <p>{address.address}</p>
                                </Col>
                                <Col span={4} style={{ textAlign: 'right' }}>
                                    <Button type="link" onClick={() => handleEditAddress(index)} icon={<EditOutlined />}>Sửa</Button>
                                    <Button type="link" onClick={() => handleDeleteAddress(index)} icon={<DeleteOutlined />}>Xóa</Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Card>

                {/* Modal for Adding/Editing Address */}
                <Modal
                    title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                    visible={isAddressModalVisible}
                    onOk={handleAddressModalOk}
                    onCancel={() => setIsAddressModalVisible(false)}
                >
                    <Form layout="vertical">
                        <Form.Item label="Họ và tên">
                            <Input name="fullName" value={editingAddress?.fullName || ''} onChange={handleAddressChange} />
                        </Form.Item>
                        <Form.Item label="Số điện thoại">
                            <Input name="phone" value={editingAddress?.phone || ''} onChange={handleAddressChange} />
                        </Form.Item>
                        <Form.Item label="Địa chỉ">
                            <Input name="address" value={editingAddress?.address || ''} onChange={handleAddressChange} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default Profile;
