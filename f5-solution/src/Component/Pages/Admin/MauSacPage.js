import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col } from "antd";
import MauSacService from "../../../Service/MauSacService";

const MauSacPage = () => {
    const [mauSacs, setMauSacs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMauSac, setEditingMauSac] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchMauSac = async (search = '') => {
        setLoading(true);
        try {
            const data = await MauSacService.getAllMauSac();
            if (search) {
                const filteredData = data.filter(mauSac =>
                    mauSac.tenMauSac.toLowerCase().includes(search.toLowerCase())
                );
                setMauSacs(filteredData);
            } else {
                setMauSacs(data);
            }
            message.success("Lấy danh sách màu sắc thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách màu sắc"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    useEffect(() => {
        fetchMauSac();
    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật Màu Sắc
    const openModal = (record = null) => {
        setModalVisible(true);
        if(record){
            setEditingMauSac(record);
            form.setFieldValue({
                ...record,
                trangThai: record.trangThai,
            });
        }else{
            setEditingMauSac(null);
            form.resetFields();
        }
    };

    // Xử lý khi tạo mới Màu sắc
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newMauSac = {
                tenMauSac: values.tenMauSac,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await MauSacService.createMauSac(newMauSac);
            console.log('Create response:', response);
            message.success("Thêm mới Màu sắc thành công");

            setModalVisible(false);
            fetchMauSac();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Xử lý khi cập nhật Màu Sắc
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);

            const updatedValues = {
                id: editingMauSac.id,
                tenMauSac: values.tenMauSac,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await MauSacService.updateMauSac(editingMauSac.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Màu sắc thành công");

            setModalVisible(false);
            fetchMauSac();
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
        if (editingMauSac) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };


    // Hàm chuyển trạng thái Màu sắc
    const handleStatusChange = async (mauSac, newStatus) => {
        try {
            const updateMauSac = {
                ...mauSac,
                trangThai: newStatus ? 1 : 0,
            };
            await MauSacService.updateMauSac(mauSac.id, updateMauSac);
            message.success("Chuyển trạng thái Màu sắc thành công");
            fetchMauSac(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Màu sắc");
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
            title: "Tên Màu Sắc",
            dataIndex: "tenMauSac",
            key: "tenMauSac",
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
        fetchMauSac(searchTerm);
    };

    return (
        <div>
            <h2>Quản lý Màu Sắc</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên màu sắc"
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
                        Thêm màu sắc mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={mauSacs}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: mauSacs.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa Màu Sắc */}
            <Modal
                title={editingMauSac ? "Cập nhật Màu Sắc" : "Thêm mới Màu Sắc"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Màu Sắc"
                        name="tenMauSac"
                        rules={[{ required: true, message: "Vui lòng nhập tên Màu sắc" }]}
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

export default MauSacPage;