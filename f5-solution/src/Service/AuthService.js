import http from "../common/http-common"; // Import http từ http-common

// Định nghĩa một object chứa tất cả các hàm liên quan đến đăng ký và đăng nhập
const AuthService = {
    // Hàm đăng ký khách hàng
    registerCustomer: async (customerData) => {
        try {
            const response = await http.post('Authentication/register', customerData); // Sử dụng http thay vì axios
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định'; // Bắt lỗi và trả về thông báo lỗi
        }
    },

    // Hàm đăng ký nhân viên
    registerNhanVien: async (nhanVienData) => {
        try {
            const response = await http.post('Authentication/register/NhanVien', nhanVienData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định';
        }
    },

    // Hàm đăng nhập khách hàng
    loginCustomer: async (username, password) => {
        try {
            const response = await http.post(`Authentication/login?Username=${username}&Password=${password}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định';
        }
    },

    // Hàm đăng nhập nhân viên
    loginNhanVien: async (username, password) => {
        try {
            const response = await http.post(`Authentication/nhanvien/login?Username=${username}&Password=${password}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định';
        }
    }
};

// Export default object AuthService
export default AuthService;
