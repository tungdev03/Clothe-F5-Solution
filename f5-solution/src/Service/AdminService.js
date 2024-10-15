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
};

// Export default object AuthService
export default AdminService;
