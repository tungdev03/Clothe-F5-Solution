import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col } from "antd";
import ChatLieuService from '../../../Service/ChatLieuService';

const ChatLieuPage = () => {
    const [chatLieus, setChatLieus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const [editingChatLieu, setEditingChatLieu] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchChatLieu = async (search = '') => {
        setLoading(true);
        try {
            // Lấy danh sách tất cả các Chất liệu, có thể tìm kiếm theo tên
            const data = await ChatLieuService.getAllChatLieu(); // Giả sử API này trả về tất cả Chất liệu
            if (search) {
                const filteredData = data.filter(chatLieu =>
                    chatLieu.tenChatLieu.toLowerCase().includes(search.toLowerCase())
                );
                setChatLieus(filteredData);
            } else {
                setChatLieus(data);
            }
            message.success("Lấy danh sách chất liệu thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách chất liệu"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };


    useEffect(() => {
        fetchChatLieu();
    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật Chất liệu
    const openModal = (record = null) => {
        setModalVisible(true);
        if (record) {
            setEditingChatLieu(record);
            // Chuyển đổi trangThai từ số thành boolean cho checkbox
            form.setFieldsValue({
                ...record,
                trangThai: record.trangThai, // 1 thành true, 0 thành false
            });
        } else {
            setEditingChatLieu(null);
            form.resetFields();
        }
    };

    // Xử lý khi tạo mới Chất liệu
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newChatLieu = {
                tenChatLieu: values.tenChatLieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await ChatLieuService.createChatLieu(newChatLieu);
            console.log('Create response:', response);
            message.success("Thêm mới Chất liệu thành công");

            setModalVisible(false);
            fetchChatLieu();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Xử lý khi cập nhật Chất liệu
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);

            const updatedValues = {
                id: editingChatLieu.id,
                tenChatLieu: values.tenChatLieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await ChatLieuService.updateChatLieu(editingChatLieu.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Chất liệu thành công");

            setModalVisible(false);
            fetchChatLieu();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Xử lý khi submit form
    const handleOk = () => {
        if (editingChatLieu) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };

    // Hàm chuyển trạng thái Chất liệu 
    const handleStatusChange = async (chatLieu, newStatus) => {
        try {
            const updatedChatLieu = {
                ...chatLieu,
                trangThai: newStatus ? 1 : 0,
            };
            await ChatLieuService.updateChatLieu(chatLieu.id, updatedChatLieu);
            message.success("Chuyển trạng thái Chất liệu thành công");
            fetchChatLieu(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Chất liệu");
        }
    };

    // Cấu hình các cột trong bảng
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 70,
        },
        {
            title: "Tên Chất liệu",
            dataIndex: "tenChatLieu",
            key: "tenChatLieu",
        },
        {
            title: "Mô tả",
            dataIndex: "moTa",
            key: "moTa",
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (text, record) => (
                <Switch
                    checked={text === 1}
                    onChange={(checked) => handleStatusChange(record, checked)}
                />
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => openModal(record)}
                        style={{ marginRight: 10 }}
                    >
                        Sửa
                    </Button>
                </>
            ),
        },
    ];

    // Hàm xử lý tìm kiếm
    const handleSearch = () => {
        fetchChatLieu(searchTerm);
    };


    return (
        <div>
            <h2>Quản lý Chất liệu</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên chất liệu"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state tìm kiếm
                        style={{ width: 800 }} // Chiều rộng của input
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={handleSearch}>
                        Tìm kiếm
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={() => openModal()}
                        style={{ marginLeft: 10, width: 300 }} // Thêm margin-left cho nút Thêm mới
                    >
                        Thêm chất liệu mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={chatLieus}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: chatLieus.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa Chất liệu */}
            <Modal
                title={editingChatLieu ? "Cập nhật Chất liệu" : "Thêm mới Chất liệu"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Chất liệu"
                        name="tenChatLieu"
                        rules={[{ required: true, message: "Vui lòng nhập tên chất liệu" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="moTa">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="trangThai"
                    >
                        <Radio.Group>
                            <Radio value={1}>Hoạt động</Radio>
                            <Radio value={0}>Không hoạt động</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ChatLieuPage;
