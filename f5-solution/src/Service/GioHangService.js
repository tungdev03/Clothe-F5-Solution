import http from "../common/http-common";



const GiohangService = {
  // Lấy danh sách giỏ hàng của một khách hàng
  getAllGioHang : async (idKh) => {
    try {
      const response = await http.get(`GioHang/GetAllGioHang/${idKh}`);
      if (!response.data || response.data.length === 0) {
        console.log("Giỏ hàng hiện tại trống.");
        return [];  // Trả về mảng rỗng nếu giỏ hàng trống
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching cart items:", error.response?.data || error.message);
      throw error;  // Quản lý lỗi khác (ví dụ lỗi mạng, server)
    }
  },
  getByGioHang : async (idKh) => {
    try {
      const response = await http.get(`GioHang/GetByGioHang/${idKh}`);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching cart items:", error.response?.data || error.message);
      throw error;  // Quản lý lỗi khác (ví dụ lỗi mạng, server)
    }
  },

  // Lấy chi tiết một giỏ hàng theo ID
  getGioHangById: async (id) => {
    try {
      const response = await http.get(`GioHang/GetGioHangById/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart item:", error.response?.data || error.message);
      throw error;
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  addGioHang: async (addDto) => {
    try {
      const response = await http.post(`GioHang/AddGioHang`, addDto);
      return response.data;
    } catch (error) {
      console.error("Error adding cart item:", error.response?.data || error.message);
      throw error;
    }
  },

  // Cập nhật giỏ hàng
  updateGioHang: async (updateDto) => {
    try {
      const response = await http.put(`GioHang/UpdateGioHang`, updateDto);
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error.response?.data || error.message);
      throw error;
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  deleteGioHang: async (id) => {
    try {
      const response = await http.delete(`GioHang/DeleteGioHang/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting cart item:", error.response?.data || error.message);
      throw error;
    }
  },
  getMaVouchers: async (ma) => {
    try {
      const response = await http.get(`VouCher/${ma}`); // Lấy voucher theo mã
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.info("Voucher không tồn tại!"); // Thông báo 'info' khi mã không tồn tại
      } else {
        console.error("Đã xảy ra lỗi khi kiểm tra voucher."); // Thông báo lỗi khác nếu có
      }
      throw error; // Ném lỗi ra ngoài để xử lý tiếp nếu cần
  }
  },
  placeOrder: async (idKh, orderInfo) => {
    try {
      const response = await http.post(
        `GioHang/place-order?idKh=${idKh}`, // Truyền idKh qua query parameter
        orderInfo // Dữ liệu đơn hàng gửi qua body
      );
      return response.data; // Trả về phản hồi từ API
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message); // In ra lỗi nếu có
      throw error; // Ném lỗi ra ngoài
    }
  }
  

};

export default GiohangService;
