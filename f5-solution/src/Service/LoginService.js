import * as http from "../common/http-common"

const urlAPI = "https://localhost:7030/api"; // Đặt lại base URL nếu cần thiết

// Hàm đăng nhập
export const LoginService = async (username, password) => {
    try {
        const response = await http.post(`${urlAPI}/Authentication/login`, { username, password });
        return response; // Trả về phản hồi từ API
    } catch (error) {
        // Xử lý lỗi và ném lỗi ra ngoài
        console.error('Login error:', error);
        throw error;
    }
};
export const registerUser = async (userData) => {
    try {
        const response = await http.post(`${urlAPI}/Authentication/register`, userData);
        return response; // Trả về phản hồi từ API
    } catch (error) {
        // Xử lý lỗi và ném lỗi ra ngoài
        console.error('Register error:', error);
        throw error;
    }
};
export const registerEmployee = async (userData) => {
    try {
        const response = await http.post(`${urlAPI}/Authentication/register/employee`, userData);
        return response; // Trả về phản hồi từ API
    } catch (error) {
        // Xử lý lỗi và ném lỗi ra ngoài
        console.error('Register error:', error);
        throw error;
    }
};
export default {
    LoginService,
    registerUser,
    registerEmployee
};
