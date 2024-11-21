import http from "../common/http-common"; // Import http từ http-common
const DanhMucService = {
     // Hàm tạo mới thuộc tính
     createCategory: async (categoryData) => {
          try {
               const response = await http.post('DanhMuc', categoryData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateCategory: async (id, categoryData) => {
          try {
              const response = await http.put(`DanhMuc/${id}`, categoryData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getCategoryById: async (id) => {
          try {
               const response = await http.get(`DanhMuc/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllCategory: async () => {
          try {
               const response = await http.get('DanhMuc'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default DanhMucService;