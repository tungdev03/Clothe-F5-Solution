import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
 // Import header
import CustomHeader from '../../Layouts/Header/Header';
import './Contact.css';

const { TextArea } = Input;

const ContactPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        console.log('Received values: ', values);

        // Giả sử bạn muốn gửi dữ liệu lên server, bạn có thể sử dụng fetch hoặc axios tại đây.
        // fetch('/api/contact', { method: 'POST', body: JSON.stringify(values) })...

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
            {/* Thêm CustomHeader */}
            <CustomHeader />

            <div className="contact-container">
                <h2>Liên hệ với chúng tôi</h2>
                <Form
                    form={form}
                    layout="vertical"
                    name="contactForm"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        label="Họ và tên"
                        name="fullname"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn!' }]}
                    >
                        <Input placeholder="Nhập họ và tên của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email của bạn!' },
                            { type: 'email', message: 'Địa chỉ email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại của bạn!' },
                            { pattern: /^\d{10}$/, message: 'Số điện thoại phải là 10 chữ số!' }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="message"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung tin nhắn!' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập nội dung liên hệ của bạn" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Gửi liên hệ
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ContactPage;
