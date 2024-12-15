import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Select, Upload } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import ImageService from "../../../Service/ImageService";
import ProductService from "../../../Service/ProductService";

const { Option } = Select;

const ImageManagement = () => {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [form] = Form.useForm();
  const pageSize = 10;

  // Lấy danh sách hình ảnh từ API
  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await ImageService.getAllImages();
      setImages(data);
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
  const handleSaveImageDetail = async (fieldData) => {
    if (!fieldData) {
        message.error('Dữ liệu chi tiết sản phẩm không xác định.');
        return;
    }

    try {
        if (fieldData.Id) {  // Ensure the check is on fieldData not productDetails
            await ProductService.addorupdateImage({
               
                ...fieldData
            });
            message.success("Sản phẩm chi tiết đã được cập nhật thành công");
        } else {
            await ProductService.addorupdateImage({
            
                ...fieldData
            });
            message.success("Sản phẩm chi tiết mới đã được tạo thành công");
        }
        form.resetFields();
        console.log('Kết quả:', fieldData);
        openModal(); // Refresh details
    } catch (error) {
        console.error("Lỗi khi thêm hoặc cập nhật chi tiết sản phẩm:", error);
        message.error(`Thêm hoặc cập nhật chi tiết sản phẩm thất bại: ${error}`);
    }
};

  useEffect(() => {
    fetchImages();
    fetchProducts();
  }, []);

  // Hàm lấy tên sản phẩm theo id
  const getProductNameById = (idSp) => {
    const product = products.find((p) => p.id === idSp);
    return product ? product.tenSp : "Không tìm thấy sản phẩm";
  };

  const openModal = (record) => {
    setEditingImage(record);
    form.setFieldsValue({
      idSp: record?.idSp || undefined,
      images: record?.images || [],
    });
    setModalVisible(true);
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
        .catch(() => {
          message.error('Lỗi khi cập nhật hình ảnh');
        });
    } else {
      ImageService.createImage(imageData)
        .then(() => {
          message.success('Thêm mới hình ảnh thành công');
          setModalVisible(false);
          fetchImages();
        })
        .catch(() => {
          message.error('Lỗi khi thêm mới hình ảnh');
        });
    }
  };

  // Hàm xóa hình ảnh
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa hình ảnh này?",
      onOk: () => {
        ImageService.deleteImage(id)
          .then(() => {
            message.success("Xóa hình ảnh thành công");
            fetchImages();  // Sau khi xóa, gọi lại API để làm mới danh sách hình ảnh
          })
          .catch(() => {
            message.error("Lỗi khi xóa hình ảnh");
          });
      },
    });
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
      dataIndex: "tenSp",
      key: "tenSp",
      align: "center",
      render: (productName) => productName || "Không tìm thấy",
    },
    {
      title: "Hình ảnh mặc định",
      dataIndex: "imageDefaul",
      key: "imageDefaul",
      render: (text) => <img src={text} alt="Product" style={{ width: 80, height: 90 }} />,
      align: "center",
    },
    {
      title: "Hình Ảnh",
      key: "image",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {record.images.map((image) => (
            <img
              key={image.id}
              src={image.tenImage}
              alt={"Image"}
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          ))}
        </div>
      ),
      align: "center",
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
          productName: getProductNameById(image.idSp),
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

          <Form.List
            name="images"
            initialValue={editingImage ? editingImage.images : []}
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error('Cần ít nhất một hình ảnh'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <Form.Item label={`Hình Ảnh ${key + 1}`} name={[name, 'file']}>
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        defaultFileList={
                          form.getFieldValue('images')[name]?.tenImage
                            ? [
                              {
                                uid: key,
                                name: `Hình Ảnh ${key + 1}`,
                                url: form.getFieldValue('images')[name]?.tenImage,
                              },
                            ]
                            : []
                        }
                        showUploadList={{ showPreviewIcon: false }}
                        onChange={(info) => {
                          const updatedImages = form.getFieldValue('images');
                          const file = info.fileList[0];  // Get the file from the info

                          // Update the image with new url (or file)
                          updatedImages[name] = { ...file, tenImage: file?.url || file.originFileObj };

                          form.setFieldsValue({ images: updatedImages });
                        }}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải lên</div>
                        </div>
                      </Upload>
                    </Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        const fieldData = form.getFieldValue('fields')[key.name];
                        handleSaveImageDetail(fieldData); // Gọi hàm đã gộp xử lý thêm/cập nhật
                      }}
                      style={{ marginRight: 8 }}
                    >
                      Add/Update
                    </Button>

                    <Button
                      onClick={() => remove(name)}
                      type="danger"
                      icon={<DeleteOutlined />}
                      style={{ marginTop: 8 }}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm hình ảnh
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>



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
