import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col } from "antd";
import ThuongHieuService from '../../../Service/ThuongHieuService';

const ThuongHieuPage = () => {
    const [thuongHieus, setThuongHieus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const [editingThuongHieu, setEditingThuongHieu] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchThuongHieu = async (search = '') => {
        setLoading(true);
        try {
            // Lấy danh sách tất cả các Thương Hiệu, có thể tìm kiếm theo tên
            const data = await ThuongHieuService.getAllThuongHieu(); // Giả sử API này trả về tất cả danh mục
            if (search) {
                const filteredData = data.filter(thuongHieu =>
                    thuongHieu.tenThuongHieu.toLowerCase().includes(search.toLowerCase())
                );
                setThuongHieus(filteredData);
            } else {
                setThuongHieus(data);
            }
            message.success("Lấy danh sách thương hiệu thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách thương hiệu"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    useEffect(() => {
        fetchThuongHieu();
    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật
    const openModal = (record = null) => {
        setModalVisible(true);
        if (record) {
            setEditingThuongHieu(record);
            // Chuyển đổi trangThai từ số thành boolean cho checkbox
            form.setFieldsValue({
                ...record,
                trangThai: record.trangThai, // 1 thành true, 0 thành false
            });
        } else {
            setEditingThuongHieu(null);
            form.resetFields();
        }
    };

    // Xử lý khi tạo mới
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newThuongHieu = {
                tenThuongHieu: values.tenThuongHieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await ThuongHieuService.createThuongHieu(newThuongHieu);
            console.log('Create response:', response);
            message.success("Thêm mới Thương Hiệu thành công");

            setModalVisible(false);
            fetchThuongHieu();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Xử lý khi cập nhật 
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);

            const updatedValues = {
                id: editingThuongHieu.id,
                tenThuongHieu: values.tenThuongHieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await ThuongHieuService.updateThuongHieu(editingThuongHieu.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Thương Hiệu thành công");

            setModalVisible(false);
            fetchThuongHieu();
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
        if (editingThuongHieu) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };

    // Hàm chuyển trạng thái 
    const handleStatusChange = async (thuongHieu, newStatus) => {
        try {
            const updateThuongHieu = {
                ...thuongHieu,
                trangThai: newStatus ? 1 : 0,
            };
            await ThuongHieuService.updateThuongHieu(thuongHieu.id, updateThuongHieu);
            message.success("Chuyển trạng thái Thương Hiệu thành công");
            fetchThuongHieu(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Thương Hiệu");
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
            title: "Tên Thương Hiệu",
            dataIndex: "tenThuongHieu",
            key: "tenThuongHieu",
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
        fetchThuongHieu(searchTerm);
    };

    return (
        <div>
            <h2>Quản lý Thương Hiệu</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên thương hiệu"
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
                        Thêm thương hiệu mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={thuongHieus}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: thuongHieus.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa Danh mục */}
            <Modal
                title={editingThuongHieu ? "Cập nhật Thương Hiệu" : "Thêm mới Thương Hiệu"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Thương Hiệu"
                        name="tenThuongHieu"
                        rules={[{ required: true, message: "Vui lòng nhập tên Thương Hiệu" }]}
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
export default ThuongHieuPage;