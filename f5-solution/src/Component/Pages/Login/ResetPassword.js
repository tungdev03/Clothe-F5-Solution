import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import BackgroundImage from '../../../assets/images/Back_Login.png'; // Replace with your background image path
import logo_v1 from '../../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Email submitted for password reset:', values);
        // Implement password reset logic (e.g., send request to API)
    };

    const handleLoginRedirect = () => {
        navigate('/Login');
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
                        alt="Forgot Password Illustration"
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
                                QUÊN MẬT KHẨU
                            </h1>
                        </div>
                    </Row>

                    <Form
                        name="forgot_password"
                        className="forgot-password-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ textAlign: 'center' }}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email!' }, { type: 'email', message: 'Địa chỉ email không hợp lệ!' }]}
                        >
                            <Input
                                size="large"
                                style={{ width: '90%' }}
                                prefix={<MailOutlined />}
                                placeholder="Email"
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                className="forgot-password-button"
                                style={{
                                    width: '60%',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderColor: 'black'
                                }}
                            >
                                Gửi yêu cầu
                            </Button>
                        </Form.Item>

                        <Row style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Col span={24}>
                                <a href="#" onClick={handleLoginRedirect} style={{ color: 'blue' }}>
                                    Quay lại trang đăng nhập
                                </a>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
