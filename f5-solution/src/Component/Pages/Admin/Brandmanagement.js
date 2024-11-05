import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Select } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import BrandService from "../../../Service/BrandService";
import "./Brandmanagement.css";

const { Option } = Select;

const Brandmanagement = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchBrand = async (search = "", status = "all") => {
        setLoading(true);
        try {
            const data = await BrandService.getAllBrand();
            const filteredData = data.filter(brand => {
                 const matchesSearch = brand.tenThuongHieu 
                ? brand.tenThuongHieu.toLowerCase().includes(search.toLowerCase()) 
                : false;
                const matchesStatus = status === "all" || (status === "active" && brand.trangThai === 1) || (status === "inactive" && brand.trangThai === 0);
                return matchesSearch && matchesStatus;
            });
            setBrands(filteredData);
            message.success("Lấy danh sách thương hiệu thành công");
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi lấy danh sách thương hiệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrand();
    }, []);

    const openModal = (record = null) => {
        setModalVisible(true);
        setEditingBrand(record);
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
            const newBrand = {
                tenThuongHieu: values.tenThuongHieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
            };
            const response = await BrandService.createBrand(newBrand);
            console.log('Create response:', response);
            message.success("Thêm mới Thương Hiệu thành công");
            setModalVisible(false);
            fetchBrand(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
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
                id: editingBrand.id,
                tenThuongHieu: values.tenThuongHieu,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
            };
            const response = await BrandService.updateBrand(editingBrand.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Thương Hiệu thành công");
            setModalVisible(false);
            fetchBrand(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
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
        if (editingBrand) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleStatusChange = async (brand, newStatus) => {
        try {
            const updateBrand = {
                ...brand,
                trangThai: newStatus ? 1 : 0,
            };
            await BrandService.updateBrand(brand.id, updateBrand);
            message.success("Chuyển trạng thái Thương Hiệu thành công");
            fetchBrand(searchTerm, statusFilter); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Thương Hiệu");
        }
    };

    const handleFilter = () => {
        fetchBrand(searchTerm, statusFilter); // Gọi hàm lọc khi người dùng nhấn nút Lọc
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
            title: "Tên Thương Hiệu",
            dataIndex: "tenThuongHieu",
            key: "tenThuongHieu",
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
        <div className="brand-management">
            <h2>Quản lý Thương Hiệu</h2>
            <div className="brand-management-container">
                <div className="sidebar">
                    <h2>Bộ lọc</h2>
                    <Input
                        placeholder="Tìm kiếm tên thương hiệu..."
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
                        Thêm thương hiệu mới
                    </Button>

                    <Table
                        columns={columns}
                        dataSource={brands}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: brands.length,
                            onChange: (page) => setCurrentPage(page),
                        }}
                    />

                    <Modal
                        title={editingBrand ? "Cập nhật Thương Hiệu" : "Thêm mới Thương Hiệu"}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                    >
                        <Form form={form} layout="vertical" onFinish={handleOk}>
                            <Form.Item
                                label="Tên Thương Hiệu"
                                name="tenThuongHieu"
                                rules={[{ required: true, message: "Vui lòng nhập tên Thương Hiệu" }]}
                            >
                                <Input placeholder="Nhập tên thương hiệu" />
                            </Form.Item>
                            <Form.Item label="Mô tả" name="moTa">
                                <Input.TextArea placeholder="Nhập mô tả cho thương hiệu" rows={4} />
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

export default Brandmanagement;
