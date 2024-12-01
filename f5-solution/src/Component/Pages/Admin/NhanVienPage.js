import React, {useState, useEffect} from 'react';
import {Table, Button, message, Switch, Input, Row, Col, Drawer, Form, Space, Select} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import moment from 'moment';
import AdminService from '../../../Service/AdminService';
import AuthService from '../../../Service/AuthService';

const {Option} = Select;

const NhanVienPage = () => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [Keyword, setKeyword] = useState();
    const [pageSize] = useState(10);
    const [nhanViens, setNhanViens] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [editingNhanVien, setEditingNhanVien] = useState(null);
    const [form] = Form.useForm();
    const [chucVuList, setChucVuList] = useState([]);
    const fetchNhanViens = async () => {
        setLoading(true);
        try {
            const data = await AdminService.GetNhanVien();
            if (Array.isArray(data)) {
                setNhanViens(data);
            } else {
                throw new Error("Dữ liệu không hợp lệ");
            }
            message.success('Lấy danh sách nhân viên thành công!');
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi lấy danh sách nhân viên.');
            setNhanViens([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchChucVu = async () => {
            try {
                const data = await AdminService.getChucVu();
                setChucVuList(data);
                console.log('ChucVu List:', data); // Log dữ liệu để kiểm tra
            } catch (error) {
                console.error("Caught an error while fetching ChucVu:", error);
                message.error(error.message || "Lỗi khi kết nối tới API!");
            }
        };

        fetchChucVu();
    }, []);
    useEffect(() => {
        fetchNhanViens();
    }, []);

    const handleEdit = async (record) => {
        try {
            const data = await AdminService.getNhanVienById(record.id);
            setEditingNhanVien(data);
            form.setFieldsValue(data);
            setIsDrawerVisible(true);
        } catch (error) {
            message.error('Lỗi khi lấy chi tiết nhân viên.');
        }
    };

    const handleStatusChange = async (nhanVien, newStatus) => {
        try {
            const updatedNhanVien = {
                ...nhanVien,
                trangThai: newStatus ? 1 : 0,
            };
            await AuthService.registerNhanVien(updatedNhanVien);
            message.success('Trạng thái nhân viên đã được cập nhật!');
            fetchNhanViens();
        } catch (error) {
            message.error('Không thể cập nhật trạng thái nhân viên.');
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 70,
        },
        {
            title: 'Mã NV',
            dataIndex: 'maNv',
            key: 'maNv',
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'hoVaTenNv',
            key: 'hoVaTenNv',
        },
        {
            title: 'Giới Tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            render: (text) => (text ? 'Nam' : 'Nữ'),
        },
        {
            title: 'Ngày Sinh',
            dataIndex: 'ngaySinh',
            key: 'ngaySinh',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'soDienThoai',
            key: 'soDienThoai',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Hình Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img src={text} alt="Nhân viên" width="50"/>,
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
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined/>} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button icon={<DeleteOutlined/>} onClick={() => handleDelete(record)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };


    const onSearch = async () => {
        setLoading(true);
        try {
            // Gọi hàm SearchNhanVien và truyền các giá trị Keyword và IsPublic
            const result = await AdminService.SearchNhanVien(Keyword);
            if (Array.isArray(result)) {
                setNhanViens(result);
                message.success('Tìm kiếm nhân viên thành công!');
            } else {
                throw new Error('Không có dữ liệu nhân viên');
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm nhân viên:', error);
            setNhanViens([]);
            message.error(error.message || 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const nhanVienData = {
                ...editingNhanVien,
                ...values,
                maNv: values.maNv,
                gioiTinh: values.gioiTinh === 'Nam',
                MatKhau: values.matKhau,
                IdCv: values.idCv,
                taiKhoan: values.taiKhoan || 'string',
                matKhau: values.matKhau || 'string',
                ngaySinh: values.ngaySinh,
                DiaChi: values.diaChi,
                MoTa: values.moTa,
                TrangThai: values.trangThai,
            };

            if (editingNhanVien) {
                await AuthService.registerNhanVien(nhanVienData); // Cập nhật nhân viên
                message.success('Cập nhật nhân viên thành công!');
            } else {
                await AuthService.registerNhanVien(nhanVienData); // Thêm nhân viên
                message.success('Thêm nhân viên thành công!');
            }
            handleDrawerClose();
            fetchNhanViens();
        } catch (error) {
            message.error('Lỗi khi cập nhật dữ liệu nhân viên.');
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        form.resetFields();
        setEditingNhanVien(null);
    };
    const handleChucVuChange = (value) => {
        const selectedChucVu = chucVuList.find(chucVu => chucVu.id === value);
        form.setFieldsValue({tenChucVu: selectedChucVu ? selectedChucVu.tenChucVu : ''});
    };
    const handleDelete = async (record) => {
        try {
            await AdminService.DeleteNhanVien(record.id);
            message.success('Xóa nhân viên thành công!');
            fetchNhanViens();
        } catch (error) {
            message.error('Lỗi khi xóa nhân viên.');
        }
    };
    return (
        <div>
            <h1>Quản lý nhân viên</h1>
            <Row gutter={16} style={{marginBottom: '20px'}}>
                <Col span={12}>
                    <Input.Search
                        placeholder="Nhập tên hoặc mã nhân viên"
                        onSearch={onSearch}
                        value={Keyword}
                        enterButton
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Col>
                <Col span={6}>
                    <Button type="primary" onClick={() => setIsDrawerVisible(true)}>
                        Thêm nhân viên mới
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                loading={loading}
                dataSource={nhanViens}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: nhanViens.length,
                    onChange: handleTableChange,

                }}
            />
            <Drawer
                title={editingNhanVien ? "Sửa thông tin nhân viên" : "Thêm nhân viên"}
                visible={isDrawerVisible}
                onClose={handleDrawerClose}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="idCv" label="Chức Vụ" rules={[{required: true, message: "Chọn chức vụ"}]}>
                        <Select placeholder="Chọn chức vụ" onChange={handleChucVuChange}>
                            {chucVuList.map((chucVu) => (
                                <Option key={chucVu.id} value={chucVu.id}>
                                    {chucVu.tenChucVu}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="maNv" label="Mã NV" rules={[{required: true, message: 'Nhập mã NV'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="hoVaTenNv" label="Họ và Tên" rules={[{required: true, message: 'Nhập họ và tên'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="gioiTinh" label="Giới Tính" rules={[{required: true, message: 'Chọn giới tính'}]}>
                        <Select placeholder="Chọn giới tính">
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="ngaySinh"
                        label="Ngày Sinh"
                        rules={[{required: true, message: 'Vui lòng chọn ngày sinh!'}]}
                    >
                        <Input type="date" placeholder="Chọn ngày sinh"/>
                    </Form.Item>
                    <Form.Item name="soDienThoai" label="Số Điện Thoại"
                               rules={[{required: true, message: 'Nhập số điện thoại'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{required: true, message: 'Nhập email'}]}>
                        <Input/>
                    </Form.Item>
                    {!editingNhanVien && (
                        <>
                            <Form.Item name="taiKhoan" label="Tài khoản nhân viên"
                                       rules={[{required: true, message: 'Nhập tài khoản đăng nhập'}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name="matKhau" label="Mật khẩu"
                                       rules={[{required: true, message: 'Nhập mật khẩu'}]}>
                                <Input/>
                            </Form.Item>
                        </>
                    )}
                    <Form.Item name="image" label="Hình Ảnh">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="diaChi" label="Địa Chỉ">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô Tả">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="trangThai" label="Trạng Thái">
                        <Input/>
                    </Form.Item>
                </Form>
                <Button type="primary" onClick={handleModalOk}>
                    {editingNhanVien ? "Cập nhật" : "Thêm"}
                </Button>
            </Drawer>
        </div>
    );
};

export default NhanVienPage;
