import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Form, Input, message, Select } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ImageService from "../../../Service/ImageService";
import ProductService from "../../../Service/ProductService";

const { Option } = Select;

const ImageManagement = () => {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]); // Lưu trữ danh sách sản phẩm
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form] = Form.useForm();
  const pageSize = 10;

  // Lấy danh sách hình ảnh từ API
  const fetchImages = async (search = "", status = "all") => {
    setLoading(true);
    try {
      const data = await ImageService.getAllImages();
      const filteredData = data.filter(image => {
        const matchesSearch = image.tenImage
          ? image.tenImage.toLowerCase().includes(search.toLowerCase())
          : false;
        const matchesStatus =
          status === "all" ||
          (status === "active" && image.trangThai === 1) ||
          (status === "inactive" && image.trangThai === 0);
        return matchesSearch && matchesStatus;
      });
      setImages(filteredData);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách hình ảnh");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const productsData = await ProductService.getAllProduct();
      setProducts(productsData);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm");
    }
  };

  useEffect(() => {
    fetchImages();
    fetchProducts(); // Lấy danh sách sản phẩm khi component mount
  }, []);

  // Hàm chuyển đổi id sản phẩm thành tên sản phẩm
  const getProductNameById = (idSp) => {
    const product = products.find(p => p.id === idSp);
    return product ? product.tenSp : "Không tìm thấy sản phẩm";
  };

  const handleStatusChange = (record, checked) => {
    const updatedImage = { ...record, trangThai: checked ? 1 : 0 };
    ImageService.updateImage(updatedImage.id, updatedImage)
      .then(() => {
        message.success('Trạng thái hình ảnh đã được cập nhật');
        fetchImages();
      })
      .catch((error) => {
        message.error('Lỗi khi cập nhật trạng thái hình ảnh');
      });
  };

  const openModal = (record) => {
    setEditingImage(record);
  
    // Nếu là thêm mới thì reset form, nếu chỉnh sửa thì điền giá trị vào form
    form.setFieldsValue({
      idSp: record?.idSp || undefined,  // ID sản phẩm
      tenImage: record?.tenImage || "", // Tên hình ảnh
      moTa: record?.moTa || "",         // Mô tả
      trangThai: record?.trangThai || 0 // Trạng thái
    });
  
    setModalVisible(true);
  };
  
  
  
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa hình ảnh này?",
      onOk: () => {
        ImageService.deleteImage(id)
          .then(() => {
            message.success("Xóa hình ảnh thành công");
            fetchImages();
          })
          .catch(() => {
            message.error("Lỗi khi xóa hình ảnh");
          });
      },
    });
  };

  const handleFormSubmit = (values) => {
    const imageData = {
      ...values,
      id: editingImage ? editingImage.id : undefined,
    };

    if (editingImage) {
      ImageService.updateImage(editingImage.id, imageData)
        .then(() => {
          message.success('Cập nhật hình ảnh thành công');
          setModalVisible(false);
          fetchImages();
        })
        .catch((error) => {
          message.error('Lỗi khi cập nhật hình ảnh');
        });
    } else {
      ImageService.createImage(imageData)
        .then(() => {
          message.success('Thêm mới hình ảnh thành công');
          setModalVisible(false);
          fetchImages();
        })
        .catch((error) => {
          message.error('Lỗi khi thêm mới hình ảnh');
        });
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
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center",
      render: (productName) => productName || "Không tìm thấy",
    },
    {
      title: "Tên Hình Ảnh",
      dataIndex: "tenImage",
      key: "tenImage",
      align: "center",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "center",
      render: (trangThai, record) => (
        <Switch
          checked={trangThai === 1}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="danger"
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        onClick={() => openModal(null)}
      >
        Thêm Hình Ảnh
      </Button>
  
      <Table
        columns={columns}
        dataSource={images.map((image) => ({
          ...image,
          productName: getProductNameById(image.idSp), // Hiển thị tên sản phẩm
        }))}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
      />
  
      <Modal
        title={editingImage ? "Chỉnh Sửa Hình Ảnh" : "Thêm Hình Ảnh"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Sản Phẩm"
            name="idSp"
            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
          >
            <Select placeholder="Chọn sản phẩm">
              {products.map(product => (
                <Option key={product.id} value={product.id}>
                  {product.tenSp}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tên Hình Ảnh"
            name="tenImage"
            rules={[{ required: true, message: 'Vui lòng nhập tên hình ảnh' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô Tả"
            name="moTa"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Trạng Thái"
            name="trangThai"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value={1}>Hoạt Động</Option>
              <Option value={0}>Không Hoạt Động</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingImage ? "Cập Nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ImageManagement;
