import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col } from "antd";
import SizeService from "../../../Service/SizeService";

const SizePage = () => {
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSize, setEditingSize] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchSize = async (search = '') => {
        setLoading(true);
        try {
            const data = await SizeService.getAllSize();
            if (search) {
                const filteredData = data.filter(size =>
                    size.tenSize.toLowerCase().includes(search.toLowerCase())
                );
                setSizes(filteredData);
            } else {
                setSizes(data);
            }
            message.success("Lấy danh sách size thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách size"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    useEffect(() => {
        fetchSize();
    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật Size
    const openModal = (record = null) => {
        setModalVisible(true);
        if(record){
            setEditingSize(record);
            form.setFieldValue({
                ...record,
                trangThai: record.trangThai,
            });
        }else{
            setEditingSize(null);
            form.resetFields();
        }
    };

    // Xử lý khi tạo mới Size
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newSize = {
                tenSize: values.tenSize,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await SizeService.createSize(newSize);
            console.log('Create response:', response);
            message.success("Thêm mới Size thành công");

            setModalVisible(false);
            fetchSize();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Xử lý khi cập nhật Size
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);

            const updatedValues = {
                id: editingSize.id,
                tenSize: values.tenSize,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await SizeService.updateSize(editingSize.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Size thành công");

            setModalVisible(false);
            fetchSize();
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
        if (editingSize) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };


    // Hàm chuyển trạng thái Size
    const handleStatusChange = async (size, newStatus) => {
        try {
            const updateSize = {
                ...size,
                trangThai: newStatus ? 1 : 0,
            };
            await SizeService.updateSize(size.id, updateSize);
            message.success("Chuyển trạng thái Size thành công");
            fetchSize(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Size");
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
            title: "Tên Size",
            dataIndex: "tenSize",
            key: "tenSize",
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
        fetchSize(searchTerm);
    };

    return (
        <div>
            <h2>Quản lý Size</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên size"
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
                        Thêm size mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={sizes}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: sizes.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa Size */}
            <Modal
                title={editingSize ? "Cập nhật Size" : "Thêm mới Size"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Size"
                        name="tenSize"
                        rules={[{ required: true, message: "Vui lòng nhập tên Size" }]}
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

export default SizePage;