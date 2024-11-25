import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col, Divider } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import CustomHeader from '../../Layouts/Header/Header';
import './Contact.css';
import logo_v1 from '../../../assets/images/Logo.png';

const { TextArea } = Input;

const ContactPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        console.log('Received values: ', values);

        // Giả lập thời gian xử lý
        setTimeout(() => {
            setLoading(false);
            form.resetFields(); // Reset form sau khi gửi thành công
            message.success('Tin nhắn của bạn đã được gửi thành công!');
        }, 1500);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin!');
    };

    return (
        <div>
            {/* Header */}
            <CustomHeader />

            {/* Banner */}
            <div className="contact-banner">
                <h1>Liên hệ với chúng tôi</h1>
                <p>Hãy để lại tin nhắn, chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất!</p>
                <p>F5 Fashion luôn luôn sẵn lòng hỗ trợ </p>
            </div>

            <div className="contact-container">
                <Row gutter={32}>
                    {/* Cột thông tin liên hệ */}
                    <Col xs={24} md={10}>
                        <h2>Thông tin liên hệ</h2>
                        <Divider />
                        <p><EnvironmentOutlined style={{ marginRight: 8 }} /> Địa chỉ: 123 Đường ABC, Phường XYZ, TP. HCM</p>
                        <p><MailOutlined style={{ marginRight: 8 }} /> Email: contact@company.com</p>
                        <p><PhoneOutlined style={{ marginRight: 8 }} /> Điện thoại: (+84) 123 456 789</p>
                        <div className="contact-map">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8560510909437!2d105.79864711476347!3d20.998307386014857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac7338d1ecb1%3A0x626f3a30bbf93a0!2zVHLhuqduIFThuqFjIFbEg24gQ-G7rSB24buBIFRoYW5o!5e0!3m2!1sen!2s!4v1687445368523!5m2!1sen!2s"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                        <img src={logo_v1} alt="logo" />
                    </Col>

                    {/* Cột form liên hệ */}
                    <Col xs={24} md={14}>
                        <h2>Gửi liên hệ</h2>
                        <Divider />
                        <Form
                            form={form}
                            layout="vertical"
                            name="contactForm"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="Họ và tên"
                                name="fullname"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập họ và tên của bạn"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email của bạn!' },
                                    { type: 'email', message: 'Địa chỉ email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Nhập email của bạn"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại của bạn!' },
                                    { pattern: /^\d{10}$/, message: 'Số điện thoại phải là 10 chữ số!' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Nhập số điện thoại của bạn"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Nội dung"
                                name="message"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung tin nhắn!' }]}
                            >
                                <TextArea rows={4} placeholder="Nhập nội dung liên hệ của bạn" />
                            </Form.Item>

                            <Form.Item>
                                <Button className='btn-click' type="dark" htmlType="submit" loading={loading}>
                                    Gửi liên hệ
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ContactPage;
