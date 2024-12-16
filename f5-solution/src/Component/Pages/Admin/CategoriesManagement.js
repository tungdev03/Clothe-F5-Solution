import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Select } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import CategoryService from "../../../Service/CategoryService";
import "./CategoriesManagement.css";

const { Option } = Select;

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchCategory = async (search = "", status = "all") => {
        setLoading(true);
        try {
            const data = await CategoryService.getAllCategory();
            const filteredData = data.filter(category => {
                const matchesSearch = category.tenDanhMuc.toLowerCase().includes(search.toLowerCase());
                const matchesStatus = status === "all" || (status === "active" && category.trangThai === 1) || (status === "inactive" && category.trangThai === 0);
                return matchesSearch && matchesStatus;
            });
            setCategories(filteredData);
            message.success("Lấy danh sách danh mục thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const openModal = (record = null) => {
        setModalVisible(true);
        setEditingCategory(record);
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
            const newCategory = {
                tenDanhMuc: values.tenDanhMuc,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
            };
            const response = await CategoryService.createCategory(newCategory);
            console.log('Create response:', response);
            message.success("Thêm mới Danh Mục thành công");
            setModalVisible(false);
            fetchCategory(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
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
                id: editingCategory.id,
                tenDanhMuc: values.tenDanhMuc,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
            };
            const response = await CategoryService.updateCategory(editingCategory.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Danh Mục thành công");
            setModalVisible(false);
            fetchCategory(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
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
        if (editingCategory) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleStatusChange = async (category, newStatus) => {
        try {
            const updateCategory = {
                ...category,
                trangThai: newStatus ? 1 : 0,
            };
            await CategoryService.updateCategory(category.id, updateCategory);
            message.success("Chuyển trạng thái Danh Mục thành công");
            fetchCategory(searchTerm, statusFilter); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Danh Mục");
        }
    };

    const handleFilter = () => {
        fetchCategory(searchTerm, statusFilter); // Gọi hàm lọc khi người dùng nhấn nút Lọc
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
            title: "Tên Danh Mục",
            dataIndex: "tenDanhMuc",
            key: "tenDanhMuc",
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
                <Button className="button-s" type="primary" icon={<EditOutlined />} onClick={() => openModal(record)} style={{
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
        <div className="categories-management">
            <h2>Quản lý Danh Mục</h2>
            <div className="categories-management-container">
                <div className="sidebar">
                    <h2>Bộ lọc</h2>
                    <Input
                        placeholder="Tìm kiếm tên danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
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
                    <Button className="button" type="primary" onClick={handleFilter} style={{ marginTop: 10 }}>
                        Lọc
                    </Button>
                </div>

                <div className="main-content">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ marginBottom: "20px" }}
                        onClick={() => openModal()}
                        className="button"
                    >
                        Thêm danh mục mới
                    </Button>

                    <Table
                        columns={columns}
                        dataSource={categories}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: categories.length,
                            onChange: (page) => setCurrentPage(page),
                        }}
                    />

                    <Modal
                        title={editingCategory ? "Cập nhật Danh Mục" : "Thêm mới Danh Mục"}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                    >
                        <Form form={form} layout="vertical" onFinish={handleOk}>
                            <Form.Item
                                label="Tên Danh Mục"
                                name="tenDanhMuc"
                                rules={[
                                    {
                                        required: true,     
                                        validator: (_, value) => {
                                            if (!value || value.trim() === "") {
                                                return Promise.reject("Vui lòng nhập tên Danh Mục");
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên danh mục" />
                            </Form.Item>
                            <Form.Item label="Mô tả" name="moTa">
                                <Input.TextArea placeholder="Nhập mô tả cho danh mục" rows={4} />
                            </Form.Item>
                            <Form.Item label="Trạng thái" name="trangThai" initialValue={1}>
                                <Radio.Group style={{ display: "flex", flexDirection: "row" }}>
                                    <Radio value={1}>Hoạt động</Radio>
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
                                        type="primary"
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

export default CategoriesManagement;
