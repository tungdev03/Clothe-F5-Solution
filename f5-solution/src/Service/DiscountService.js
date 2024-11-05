import http from "../common/http-common"; // Import http từ http-common
const DiscountService = {
     // Hàm tạo mới thuộc tính
     createDiscount: async (discountData) => {
          try {
               const response = await http.post('GiamGia', discountData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateDiscount: async (id, discountData) => {
          try {
              const response = await http.put(`GiamGia/${id}`, discountData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getDiscountById: async (id) => {
          try {
               const response = await http.get(`GiamGia/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllDiscount: async () => {
          try {
               const response = await http.get('GiamGia'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default DiscountService;