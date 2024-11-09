import React from 'react';
import { Form, Input, Button, Row, Col, DatePicker, Radio } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import BackgroundImage from '../../../assets/images/Back_Login.png';
import logo_v1 from '../../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../Service/AuthService'; // Import AuthService

const Register = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const onFinish = async (values) => {
        try {
            // Thực hiện đăng ký khách hàng qua AuthService
            const response = await AuthService.registerCustomer({
                hoVaTenKh: values.hoVaTenKh,
                taiKhoan: values.username,
                matKhau: values.password,
                email: values.email,
                soDienThoai: values.soDienThoai,
                gioiTinh: values.gioiTinh,
                ngaySinh: values.ngaySinh.format('YYYY-MM-DD'), // Chuyển đổi ngày sinh về định dạng API cần
            });

            if (response && response.token) {
                localStorage.setItem('user', JSON.stringify(response));
                alert('Đăng ký thành công!');
                navigate('/'); // Chuyển hướng sau khi đăng ký thành công
            } else {
                alert('Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.');
            }
        } catch (error) {
            // Bắt và ném lỗi ra bên ngoài
            alert('Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.');
        }
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
                                ĐĂNG KÝ TÀI KHOẢN
                            </h1>
                        </div>
                    </Row>

                    <Form
                        name="register_form"
                        className="register-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ textAlign: 'center' }}
                    >
                        <Form.Item
                            name="hoVaTenKh"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input
                                size="large"
                                style={{ width: '90%' }}
                                placeholder="Họ và tên"
                            />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                        >
                            <Input
                                size="large"
                                style={{ width: '90%' }}
                                prefix={<UserOutlined />}
                                placeholder="Tên tài khoản"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu"
                                size="large"
                                style={{ width: '90%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                size="large"
                                placeholder="Email"
                                style={{ width: '90%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="soDienThoai"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                size="large"
                                placeholder="Số điện thoại"
                                style={{ width: '90%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="gioiTinh"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                            <Radio.Group>
                                <Radio value={true}>Nam</Radio>
                                <Radio value={false}>Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="ngaySinh"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                        >
                            <DatePicker placeholder="Ngày sinh" style={{ width: '90%' }} />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                className="register-form-button"
                                style={{
                                    width: '60%',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderColor: 'black'
                                }}
                            >
                                Đăng kí
                            </Button>
                        </Form.Item>

                        <Row style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Col span={24}>
                                Bạn đã có tài khoản
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
                                onClick={handleLogin}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
