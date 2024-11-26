import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Select } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import MaterialService from "../../../Service/MaterialService";
import "./MaterialManagement.css";

const { Option } = Select;

const MaterialManagement = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchMaterial = async (search = "", status = "all") => {
        setLoading(true);
        try {
            const data = await MaterialService.getAllMaterial();
            const filteredData = data.filter(material => {
                const matchesSearch = material.tenChatLieu.toLowerCase().includes(search.toLowerCase());
                const matchesStatus = status === "all" || (status === "active" && material.trangThai === 1) || (status === "inactive" && material.trangThai === 0);
                return matchesSearch && matchesStatus;
            });
            setMaterials(filteredData);
            message.success("Lấy danh sách Chất Liệu thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách Chất Liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterial();
    }, []);

    const openModal = (record = null) => {
        setModalVisible(true);
        setEditingMaterial(record);
        if (record) {
            form.setFieldsValue({ ...record, trangThai: record.trangThai });
        } else {
            form.resetFields();
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);
            const newMaterial = {
                tenChatLieu: values.tenChatLieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
            };
            const response = await MaterialService.createMaterial(newMaterial);
            console.log('Create response:', response);
            message.success("Thêm mới Chất Liệu thành công");
            setModalVisible(false);
            fetchMaterial(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);
            const updatedValues = {
                id: editingMaterial.id,
                tenChatLieu: values.tenChatLieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
            };
            const response = await MaterialService.updateMaterial(editingMaterial.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Chất Liệu thành công");
            setModalVisible(false);
            fetchMaterial(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    const handleOk = async () => {
        if (editingMaterial) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleStatusChange = async (material, newStatus) => {
        try {
            const updateMaterial = {
                ...material,
                trangThai: newStatus ? 1 : 0,
            };
            await MaterialService.updateMaterial(material.id, updateMaterial);
            message.success("Chuyển trạng thái Chất Liệu thành công");
            fetchMaterial(searchTerm, statusFilter); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Chất Liệu");
        }
    };

    const handleFilter = () => {
        fetchMaterial(searchTerm, statusFilter); // Gọi hàm lọc khi người dùng nhấn nút Lọc
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 70,
            align: "center",
        },
        {
            title: "Tên Chất Liệu",
            dataIndex: "tenChatLieu",
            key: "tenChatLieu",
            align: "center",
        },
        {
            title: "Mô tả",
            dataIndex: "moTa",
            key: "moTa",
            align: "center",
        },
        {
            title: "Trạng Thái",
            dataIndex: "trangThai",
            key: "trangThai",
            render: (text, record) => (
                <Switch checked={text === 1} onChange={(checked) => handleStatusChange(record, checked)} />
            ),
            align: "center",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button className="button-s" type="dark" icon={<EditOutlined />} onClick={() => openModal(record)} style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    marginRight: 10
                }}>
                    Sửa
                </Button>
            ),
            align: "center",
        },
    ];

    return (
        <div className="material-management">
            <h2>Quản lý Chất Liệu</h2>
            <div className="material-management-container">
                <div className="sidebar">
                    <h2>Bộ lọc</h2>
                    <Input
                        placeholder="Tìm kiếm tên chất liệu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        
                    />
                    <Select
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: "100%", marginTop: 10 }}
                    >
                        <Option value="all">Tất cả</Option>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Ngừng hoạt động</Option>
                    </Select>
                    <Button className="button1"  onClick={handleFilter} style={{ marginTop: 10 }}>
                        Lọc
                    </Button>
                </div>

                <div className="main-content">
                    <Button
                        type="dark"
                        icon={<PlusOutlined />}
                        style={{ marginBottom: "20px" }}
                        onClick={() => openModal()}
                        className="button1"
                    >
                        Thêm chất liệu mới
                    </Button>

                    <Table
                        columns={columns}
                        dataSource={materials}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: materials.length,
                            onChange: (page) => setCurrentPage(page),
                        }}
                    />

                    <Modal
                        title={editingMaterial ? "Cập nhật Chất Liệu" : "Thêm mới Chất Liệu"}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                    >
                        <Form form={form} layout="vertical" onFinish={handleOk}>
                            <Form.Item
                                label="Tên Chất Liệu"
                                name="tenChatLieu"
                                rules={[{ required: true, message: "Vui lòng nhập tên Chất Liệu" }]}
                            >
                                <Input placeholder="Nhập tên chất liệu" />
                            </Form.Item>
                            <Form.Item label="Mô tả" name="moTa">
                                <Input.TextArea placeholder="Nhập mô tả cho chất liệu" rows={4} />
                            </Form.Item>
                            <Form.Item label="Trạng thái" name="trangThai" initialValue={1}>
                                <Radio.Group style={{ display: "flex", flexDirection: "row" }}>
                                    <Radio type="dark" value={1}>Hoạt động</Radio>
                                    <Radio value={0}>Không hoạt động</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <Button
                                        onClick={() => setModalVisible(false)}
                                        style={{ flex: 1, height: '40px' }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="dark"
                                        htmlType="submit"
                                        style={{ flex: 1, height: '40px' }}
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default MaterialManagement;
