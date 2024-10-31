import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col } from "antd";
import XuatXuService from "../../../Service/XuatXuService"

const XuatXuPage = () => {
    const [xuatXus, setXuatXus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const [editingXuatXu, setEditingXuatXu] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchXuatXu = async (search = '') => {
        setLoading(true);
        try {
            // Lấy danh sách tất cả các Xuất xứ, có thể tìm kiếm theo tên
            const data = await XuatXuService.getAllXuatXu(); // Giả sử API này trả về tất cả danh mục
            if (search) {
                const filteredData = data.filter(xuatXu =>
                    xuatXu.tenXuatXu.toLowerCase().includes(search.toLowerCase())
                );
                setXuatXus(filteredData);
            } else {
                setXuatXus(data);
            }
            message.success("Lấy danh sách xuất xứ thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách xuất xứ"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    useEffect(() => {
        fetchXuatXu();
    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật
    const openModal = (record = null) => {
        setModalVisible(true);
        if (record) {
            setEditingXuatXu(record);
            // Chuyển đổi trangThai từ số thành boolean cho checkbox
            form.setFieldsValue({
                ...record,
                trangThai: record.trangThai, // 1 thành true, 0 thành false
            });
        } else {
            setEditingXuatXu(null);
            form.resetFields();
        }
    };

    // Xử lý khi tạo mới
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newXuatXu = {
                tenXuatXu: values.tenXuatXu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await XuatXuService.createXuatXu(newXuatXu);
            console.log('Create response:', response);
            message.success("Thêm mới Xuất Xứ thành công");

            setModalVisible(false);
            fetchXuatXu();
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
                id: editingXuatXu.id,
                tenXuatXu: values.tenXuatXu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await XuatXuService.updateXuatXu(editingXuatXu.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Xuất Xứ thành công");

            setModalVisible(false);
            fetchXuatXu();
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
        if (editingXuatXu) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };

    // Hàm chuyển trạng thái 
    const handleStatusChange = async (xuatXu, newStatus) => {
        try {
            const updateXuatXu = {
                ...xuatXu,
                trangThai: newStatus ? 1 : 0,
            };
            await XuatXuService.updateXuatXu(xuatXu.id, updateXuatXu);
            message.success("Chuyển trạng thái Xuất Xứ thành công");
            fetchXuatXu(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Xuất Xứ");
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
            title: "Tên Xuất Xứ",
            dataIndex: "tenXuatXu",
            key: "tenXuatXu",
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
        fetchXuatXu(searchTerm);
    };

    return (
        <div>
            <h2>Quản lý Xuất Xứ</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên xuất xứ"
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
                        Thêm xuất xứ mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={xuatXus}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: xuatXus.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa Xuất xứ */}
            <Modal
                title={editingXuatXu ? "Cập nhật Xuất Xứ" : "Thêm mới Xuất Xứ"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Xuất Xứ"
                        name="tenXuatXu"
                        rules={[{ required: true, message: "Vui lòng nhập tên Xuất Xứ" }]}
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
export default XuatXuPage;