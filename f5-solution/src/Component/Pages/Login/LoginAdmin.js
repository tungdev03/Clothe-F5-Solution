import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import BackgroundImage from '../../../assets/images/Back_Login.png'; // Đường dẫn tới hình nền
import logo_v1 from '../../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../Service/AuthService'; // Import AuthService
import { jwtDecode } from 'jwt-decode';
const LoginAdmin = () => {
    const [loading, setLoading] = useState(false); // Trạng thái tải
    const navigate = useNavigate();
    //path-key
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await AuthService.loginNhanVien(values.username, values.password);
            if (response && response.token) {
                // Giải mã token JWT (nếu sử dụng JWT)
                const decodedToken = jwtDecode(response.token)
                // Lưu thông tin người dùng và token vào localStorage
                localStorage.setItem('user', JSON.stringify(decodedToken));
                localStorage.setItem('token', response.token);

                navigate("/Dashboard")

                message.success('Đăng nhập thành công!');
            } else {
                message.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate('/resetPassword');
    };

    const handleRegister = () => {
        navigate('/register')
    };

    return (
        <div style={{
            position: 'relative',
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',

                zIndex: 1,
            }} />

            <div style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '600px',
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <img
                    src={logo_v1}
                    alt="Logo"
                    style={{ width: '150px', marginBottom: '20px' }}
                />

                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '20px',
                    letterSpacing: '1px'
                }}>
                    ĐĂNG NHẬP
                </h1>

                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input
                            size="large"
                            style={{ width: '100%' }}
                            prefix={<UserOutlined />}
                            placeholder="Tên đăng nhập"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Mật khẩu"
                            size="large"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            className="login-form-button"
                            loading={loading} // Hiển thị trạng thái tải
                            style={{
                                width: '100%',
                                backgroundColor: 'black',
                                color: 'white',
                                borderColor: 'black',
                                borderRadius: '5px',
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <Row style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Col span={24}>
                            <a href="#" onClick={handleForgotPassword} style={{ color: '#1890ff' }}>
                                Quên mật khẩu?
                            </a>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default LoginAdmin;
