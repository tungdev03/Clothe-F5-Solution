import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col } from "antd";
import DanhMucService from '../../../Service/DanhMucService';

const DanhMucPage = () => {
    const [danhMucs, setDanhMucs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const [editingDanhMuc, setEditingDanhMuc] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchDanhMuc = async (search = '') => {
        setLoading(true);
        try {
            // Lấy danh sách tất cả các Danh mục, có thể tìm kiếm theo tên
            const data = await DanhMucService.getAllDanhMuc(); // Giả sử API này trả về tất cả danh mục
            if (search) {
                const filteredData = data.filter(danhMuc =>
                    danhMuc.tenDanhMuc.toLowerCase().includes(search.toLowerCase())
                );
                setDanhMucs(filteredData);
            } else {
                setDanhMucs(data);
            }
            message.success("Lấy danh sách danh mục thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách danh mục"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    useEffect(() => {
        fetchDanhMuc();
    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật
    const openModal = (record = null) => {
        setModalVisible(true);
        if (record) {
            setEditingDanhMuc(record);
            // Chuyển đổi trangThai từ số thành boolean cho checkbox
            form.setFieldsValue({
                ...record,
                trangThai: record.trangThai, // 1 thành true, 0 thành false
            });
        } else {
            setEditingDanhMuc(null);
            form.resetFields();
        }
    };

    // Xử lý khi tạo mới
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newDanhMuc = {
                tenDanhMuc: values.tenDanhMuc,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await DanhMucService.createDanhMuc(newDanhMuc);
            console.log('Create response:', response);
            message.success("Thêm mới Danh mục thành công");

            setModalVisible(false);
            fetchDanhMuc();
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
                id: editingDanhMuc.id,
                tenDanhMuc: values.tenDanhMuc,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await DanhMucService.updateDanhMuc(editingDanhMuc.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Danh mục thành công");

            setModalVisible(false);
            fetchDanhMuc();
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
        if (editingDanhMuc) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };

    // Hàm chuyển trạng thái 
    const handleStatusChange = async (danhMuc, newStatus) => {
        try {
            const updateDanhMuc = {
                ...danhMuc,
                trangThai: newStatus ? 1 : 0,
            };
            await DanhMucService.updateDanhMuc(danhMuc.id, updateDanhMuc);
            message.success("Chuyển trạng thái Danh mục thành công");
            fetchDanhMuc(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Danh Mục");
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
            title: "Tên Danh Mục",
            dataIndex: "tenDanhMuc",
            key: "tenDanhMuc",
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
        fetchDanhMuc(searchTerm);
    };

    return (
        <div>
            <h2>Quản lý Danh Mục</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên danh mục"
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
                        Thêm danh mục mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={danhMucs}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: danhMucs.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa Danh mục */}
            <Modal
                title={editingDanhMuc ? "Cập nhật Danh Mục" : "Thêm mới Danh Mục"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Danh Mục"
                        name="tenDanhMuc"
                        rules={[{ required: true, message: "Vui lòng nhập tên Danh Mục" }]}
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
export default DanhMucPage;