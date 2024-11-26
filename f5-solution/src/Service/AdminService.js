import http from "../common/http-common"; // Import http từ http-common

// Định nghĩa một object chứa tất cả các hàm liên quan đến đăng ký và đăng nhập
const AdminService = {
    // Hàm đăng ký khách hàng
    GetCustomer: async () => {
        try {
            const response = await http.get('KhachHang'); // Sử dụng http thay vì axios
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định'; // Bắt lỗi và trả về thông báo lỗi
        }
    },
    GetNhanVien: async () => {
        try {
            const response = await http.get('NhanVien'); // Sử dụng http thay vì axios
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định'; // Bắt lỗi và trả về thông báo lỗi
        }
    },
    getNhanVienById: async (id) => {
        try {
            const response = await http.get(`NhanVien/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi khi lấy chi tiết nhân viên';
        }
    },
    getKhachHangById: async (id) => {
        try {
            const response = await http.get(`KhachHang/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi khi lấy chi tiết nhân viên';
        }
    },
    SearchCustomer: async (Keyword, IsPublic) => {
        try {
            const response = await http.get(`KhachHang/list?Keyword=${Keyword || ''}&Ispublic=${IsPublic ?? 0}`);
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định';
        }
    },
    SearchNhanVien: async (Keyword, IsPublic) => {
        try {
            // Tạo URL với các tham số Keyword và IsPublic
            const response = await http.get(`NhanVien/list?Keyword=${Keyword || ''}`);

            console.log("Phản hồi từ server:", response.data);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định';
        }
    },
    getKhachHangBymaKH: async (MaKh) =>{
        try {
          // Tạo URL với các tham số Keyword và IsPublic
            const response = await http.get(`KhachHang/ma-khach-hang/${MaKh}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định';
        }
    },
    getChucVu: async () => {
        try {
            const response = await http.get('ChucVu');
            return response.data;
        } catch (error) {
            console.error('Caught an error:', error.toString()); // Log full error details
            throw error.response?.data || 'Lỗi không xác định'; // Throw the most specific error possible
        }
    }
};

// Export default object AuthService
export default AdminService;
