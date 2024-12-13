import http from "../common/http-common";



const GiohangService = {
  getAllGioHang: async (idKh) => {
    try {
      const response = await http.get(`GioHang/GetAllGioHang/${idKh}`);
      if (!response.data || response.data.length === 0) {
        console.log("Giỏ hàng hiện tại trống.");
        return [];
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching cart items:", error.response?.data || error.message);
      throw error; 
    }
  },
  getByGioHang: async (idKh) => {
    try {
      const response = await http.get(`GioHang/GetByGioHang/${idKh}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching cart items:", error.response?.data || error.message);
      throw error;
    }
  },

  getGioHangById: async (id) => {
    try {
      const response = await http.get(`GioHang/GetGioHangById/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart item:", error.response?.data || error.message);
      throw error;
    }
  },

  addGioHang: async (addDto) => {
    try {
      const response = await http.post(`GioHang`, addDto);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.response?.data || error.message);
      throw error;
    }
  },

  updateGioHang: async (id, soLuong) => {
    if (!id || soLuong <= 0) {
      throw new Error("ID không hợp lệ hoặc số lượng phải lớn hơn 0.");
    }
    try {
      const response = await http.put(`GioHang/UpdateGioHang`, {
        id,
        SoLuong: soLuong,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.Message || "Có lỗi xảy ra!");
      } else {
        const connectionError = "Không thể kết nối tới server!";
        console.error(connectionError, error); // Log lỗi
        throw new Error(connectionError);
      }
    }
  },
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
  }, 
  VNPayPayment: async (customerId, orderInfo) => {
    try {
      const response = await http.post(`vnpay-payment?customerId=${customerId}`, orderInfo);
      return response.data;
    } catch (error) {
      console.error("VNPay Payment Error:", error);
      throw error.response?.data || "Lỗi khi gọi API thanh toán VNPay";
    }
  },
  
};

export default GiohangService;
