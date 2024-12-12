import http from "../common/http-common"; // Import http từ http-common

const StatisticsService = {
  // Hàm tính tổng doanh thu
  getTotalRevenue: async (startDate, endDate) => {
    try {
      const response = await http.get(`Statistics/total-revenue?startDate=${startDate}&endDate=${endDate}`);
      console.log("Total Revenue Response:", response);
      return response.data;  // Trả về dữ liệu tổng doanh thu
    } catch (error) {
      console.error("Error fetching total revenue:", error);
      throw error.response?.data || "Lỗi không xác định";             
    }         
  },

  // Hàm tính tổng số đơn hàng
  getTotalOrders: async (startDate, endDate) => {
    try {
      const response = await http.get(`Statistics/total-orders?startDate=${startDate}&endDate=${endDate}`);
      console.log("Total Orders Response:", response);
      return response.data;  // Trả về dữ liệu tổng số đơn hàng
    } catch (error) {
      console.error("Error fetching total orders:", error);
      throw error.response?.data || "Lỗi không xác định";             
    }     
  },

  // Hàm tính tổng số sản phẩm đã bán
  getTotalProductsSold: async (startDate, endDate) => {
    try {
      const response = await http.get(`Statistics/total-products-sold?startDate=${startDate}&endDate=${endDate}`);
      console.log("Total Products Sold Response:", response);
      return response.data;  // Trả về dữ liệu tổng số sản phẩm đã bán
    } catch (error) {
      console.error("Error fetching total products sold:", error);
      throw error.response?.data || "Lỗi không xác định";             
    }     
  },

  // Hàm lấy số lượng đơn hàng theo trạng thái
  getOrderStatusCounts: async (startDate, endDate) => {
    try {
      const response = await http.get(`Statistics/order-status-counts?startDate=${startDate}&endDate=${endDate}`);
      console.log("Order Status Counts Response:", response);
      return response.data;  // Trả về dữ liệu số lượng đơn hàng theo trạng thái
    } catch (error) {
      console.error("Error fetching order status counts:", error);
      throw error.response?.data || "Lỗi không xác định";             
    }
  },

  // Hàm lấy doanh thu theo tháng trong một năm
  getMonthlyRevenue: async (year) => {
    try {
      const response = await http.get(`Statistics/monthly-revenue?year=${year}`);
      console.log("Monthly Revenue Response:", response);
      return response.data;  // Trả về dữ liệu doanh thu theo tháng
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      throw error.response?.data || "Lỗi không xác định";
    }
  },
};

export default StatisticsService;