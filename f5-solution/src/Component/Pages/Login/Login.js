import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import Logo from '../../../assets/images/Banner_Login.png';
import BackgroundImage from '../../../assets/images/Back_Login.png'; // Đường dẫn tới hình nền
import logo_v1 from '../../../assets/images/Logo.png';

const Login = () => {
    const onFinish = async (values) => {
        // Add your form submission logic here
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    const handleRegister = () => {
        console.log('Register button clicked');
    };

    return (
        <div style={{
            position: 'relative',
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh', // Đảm bảo chiều cao của phần tử bao quanh toàn bộ chiều cao của cửa sổ trình duyệt
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            {/* Lớp phủ mờ */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Đặt màu nền với độ mờ khoảng 30%
                zIndex: 1, // Đảm bảo lớp phủ nằm dưới nội dung chính
            }} />

            <div style={{
                position: 'relative',
                zIndex: 2,
                width: '90%',
                maxWidth: '1200px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1', padding: '10px' }}>
                    <img
                        src={Logo}
                        alt="Login Illustration"
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ flex: '1', padding: '20px', maxWidth: '700px' }}>
                    {/* Sử dụng Flexbox để căn chỉnh logo và h1 trên cùng một hàng */}
                    <Row style={{ marginBottom: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src={logo_v1}
                                alt="Logo"
                                style={{ width: '180px', height: '180px', marginRight: '5px' }} // Logo to hơn
                            />
                            <h1 style={{
                                fontSize: '30px', // Kích thước chữ lớn hơn
                                fontWeight: 'bold',
                                fontFamily: "'Roboto', sans-serif", // Sử dụng font Roboto hiện đại
                                color: '#333',
                                margin: 0,
                                letterSpacing: '1px' // Tạo khoảng cách giữa các chữ
                            }}>
                                ĐĂNG NHẬP
                            </h1>
                        </div>
                    </Row>

                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ textAlign: 'center' }}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input
                                size="large"
                                style={{ width: '90%' }}
                                prefix={<UserOutlined />}
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                                size="large"
                                style={{ width: '90%' }}
                            />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                className="login-form-button"
                                style={{
                                    width: '60%',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderColor: 'black'
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        {/* Forgot Password Row */}
                        <Row style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Col span={24}>
                                <a href="#" onClick={handleForgotPassword} style={{ color: 'blue' }}>
                                    Quên mật khẩu?
                                </a>
                            </Col>
                        </Row>

                        {/* Register Button */}
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button
                                type="default"
                                size="large"
                                className="register-form-button"
                                style={{
                                    width: '60%',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderColor: 'black'
                                }}
                                onClick={handleRegister}
                            >
                                Đăng kí tài khoản
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
