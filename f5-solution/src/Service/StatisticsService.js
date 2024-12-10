import http from "../common/http-common"; // Import http từ http-common

const StatisticsService = {
    // Hàm tính tổng doanh thu
    getTotalRevenue: async (startDate, endDate) => {
        try {
            const response = await http.get(`Statistics/total-revenue?startDate=${startDate}&endDate=${endDate}`);
            return response.data;  // Trả về dữ liệu tổng doanh thu
        } catch (error) {
            // Kiểm tra nếu có lỗi trả về từ API, nếu không trả về lỗi mặc định
            throw error.response?.data || "Lỗi không xác định";             
        }         
    },

    // Hàm tính tổng số đơn hàng
    getTotalOrders: async (startDate, endDate) => {
        try {
            const response = await http.get(`Statistics/total-orders?startDate=${startDate}&endDate=${endDate}`);
            return response.data;  // Trả về dữ liệu tổng số đơn hàng
        } catch (error) {
            throw error.response?.data || "Lỗi không xác định";             
        }     
    },

    // Hàm tính tổng số sản phẩm đã bán
    getTotalProductsSold: async (startDate, endDate) => {
        try {
            const response = await http.get(`Statistics/total-products-sold?startDate=${startDate}&endDate=${endDate}`);
            return response.data;  // Trả về dữ liệu tổng số sản phẩm đã bán
        } catch (error) {
            throw error.response?.data || "Lỗi không xác định";             
        }     
    },

    // Hàm lấy số lượng đơn hàng theo trạng thái
    getOrderStatusCounts: async (startDate, endDate) => {
        try {
            const response = await http.get(`Statistics/order-status-counts?startDate=${startDate}&endDate=${endDate}`);
            return response.data;  // Trả về dữ liệu số lượng đơn hàng theo trạng thái
        } catch (error) {
            throw error.response?.data || "Lỗi không xác định";             
        }
    },

    // Hàm lấy doanh thu theo tháng trong một năm
    getMonthlyRevenue: async (year) => {
        try {
            const response = await http.get(`Statistics/monthly-revenue?year=${year}`);
            return response.data;  // Trả về dữ liệu doanh thu theo tháng
        } catch (error) {
            throw error.response?.data || "Lỗi không xác định";
        }
    },
};

export default StatisticsService;
