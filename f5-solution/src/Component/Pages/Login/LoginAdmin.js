import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import BackgroundImage from '../../../assets/images/Back_Login.png'; // Đường dẫn tới hình nền
import logo_v1 from '../../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import { LoginService } from '../../../Service/LoginService';
const LoginAdmin = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await LoginService(values.username, values.password);
            if (response && response.token) {
                localStorage.setItem('user', JSON.stringify(response));

                if (response.user && response.user.HoVaTenKh) {
                    navigate('/');
                } else if (response.user && response.user.HoVaTenNv) {
                    navigate('/dashboard');
                } else {
                    // Nếu không rõ vai trò, điều hướng về trang chủ
                    navigate('/');
                }
            } else {
                // Thông báo đăng nhập thất bại nếu không nhận được token
                alert('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.');
            }
        } catch (error) {
            // Xử lý lỗi nếu API trả về lỗi
            console.error('Login error:', error);
            alert('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.');
        }
    };

    const handleForgotPassword = () => {
        navigate('/resetPassword')
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
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                zIndex: 1,
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
                        src={logo_v1}
                        alt="Login Illustration"
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ flex: '1', padding: '20px', maxWidth: '700px' }}>
                    <Row style={{ marginBottom: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h1 style={{
                                fontSize: '30px',
                                fontWeight: 'bold',
                                fontFamily: "'Roboto', sans-serif",
                                color: '#333',
                                margin: 0,
                                letterSpacing: '1px'
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

                        <Row style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Col span={24}>
                                <a href="#" onClick={handleForgotPassword} style={{ color: 'blue' }}>
                                    Quên mật khẩu?
                                </a>
                            </Col>
                        </Row>

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

export default LoginAdmin;
