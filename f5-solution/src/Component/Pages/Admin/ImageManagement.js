import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Select, Upload } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ImageService from "../../../Service/ImageService";
import "./ImageManagement.css";

const { Option } = Select;

const ImageManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
    const [form] = Form.useForm();
    const pageSize = 10;

    // Lấy dữ liệu hình ảnh với bộ lọc
    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await ImageService.getAllImages(); // API lấy tất cả hình ảnh
            const filteredData = data.filter((image) => {
                const matchesSearch = image.tenHinh.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus =
                    statusFilter === "all" ||
                    (statusFilter === "active" && image.trangThai === 1) ||
                    (statusFilter === "inactive" && image.trangThai === 0);
                return matchesSearch && matchesStatus;
            });
            setImages(filteredData);
        } catch (error) {
            message.error("Lỗi khi lấy danh sách hình ảnh");
        } finally {
            setLoading(false);
        }
    };

    // Gọi `fetchImages` khi tìm kiếm hoặc trạng thái thay đổi
    useEffect(() => {
        fetchImages();
    }, [searchTerm, statusFilter]);

    const openModal = (record = null) => {
        setModalVisible(true);
        setEditingImage(record);
        if (record) {
            form.setFieldsValue({ ...record, trangThai: record.trangThai });
        } else {
            form.resetFields();
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const newImage = {
                tenHinh: values.tenHinh,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
                hinhAnh: values.hinhAnh.fileList[0]?.originFileObj, // Lấy hình ảnh từ input Upload
            };
            await ImageService.createImage(newImage);
            message.success("Thêm mới hình ảnh thành công");
            setModalVisible(false);
            fetchImages();
        } catch (error) {
            message.error("Lỗi không xác định khi xử lý dữ liệu");
        }
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const updatedImage = {
                id: editingImage.id,
                tenHinh: values.tenHinh,
                moTa: values.moTa,
                trangThai: values.trangThai === 1 ? 1 : 0,
                hinhAnh: values.hinhAnh.fileList[0]?.originFileObj,
            };
            await ImageService.updateImage(editingImage.id, updatedImage);
            message.success("Cập nhật hình ảnh thành công");
            setModalVisible(false);
            fetchImages();
        } catch (error) {
            message.error("Lỗi không xác định khi xử lý dữ liệu");
        }
    };

    const handleStatusChange = async (image, newStatus) => {
        try {
            const updatedImage = { ...image, trangThai: newStatus ? 1 : 0 };
            await ImageService.updateImage(image.id, updatedImage);
            message.success("Chuyển trạng thái hình ảnh thành công");
            fetchImages();
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái hình ảnh");
        }
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
            title: "Tên Hình Ảnh",
            dataIndex: "tenHinh",
            key: "tenHinh",
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
                <Button
                    className="button-s"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => openModal(record)}
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        marginRight: 10,
                    }}
                >
                    Sửa
                </Button>
            ),
            align: "center",
        },
    ];

    return (
        <div className="image-management">
            <h2>Quản lý Hình Ảnh</h2>
            <div className="image-management-container">
                <div className="sidebar">
                    <h2>Bộ lọc</h2>
                    <Input
                        placeholder="Tìm kiếm tên hình ảnh..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input1"
                        style={{ width: "100%" }}
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
                    <Button
                        className="button1"
                        onClick={fetchImages}
                        style={{ marginTop: 10 }}
                    >
                        Lọc
                    </Button>
                </div>

                <div className="main-content">
                    <Button
                        icon={<PlusOutlined />}
                        style={{ marginBottom: "20px" }}
                        onClick={() => openModal()}
                        className="button1"
                    >
                        Thêm hình ảnh mới
                    </Button>

                    <Table
                        columns={columns}
                        dataSource={images}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: images.length,
                            onChange: (page) => setCurrentPage(page),
                        }}
                    />

                    <Modal
                        title={editingImage ? "Cập nhật Hình Ảnh" : "Thêm mới Hình Ảnh"}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={editingImage ? handleUpdate : handleCreate}
                        >
                            <Form.Item
                                label="Tên Hình Ảnh"
                                name="tenHinh"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên Hình ảnh",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên hình ảnh" />
                            </Form.Item>
                            <Form.Item label="Mô tả" name="moTa">
                                <Input.TextArea placeholder="Nhập mô tả cho hình ảnh" rows={4} />
                            </Form.Item>
                            <Form.Item
                                label="Hình ảnh"
                                name="hinhAnh"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => e?.fileList}
                            >
                                <Upload
                                    action="/upload" // Endpoint upload hình ảnh
                                    listType="picture-card"
                                    accept="image/*"
                                    showUploadList={false}
                                >
                                    <Button icon={<PlusOutlined />}>
                                        Chọn Hình ảnh
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                label="Trạng thái"
                                name="trangThai"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}>Hoạt động</Radio>
                                    <Radio value={0}>Ngừng hoạt động</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="button">
                                    {editingImage ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ImageManagement;
