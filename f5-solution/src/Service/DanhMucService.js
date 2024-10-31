import http from "../common/http-common"; // Import http từ http-common
const DanhMucService = {
     // Hàm tạo mới thuộc tính
     createDanhMuc: async (danhMucData) => {
          try {
               const response = await http.post('DanhMuc', danhMucData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateDanhMuc: async (id, danhMucData) => {
          try {
              const response = await http.put(`DanhMuc/${id}`, danhMucData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getDanhMucById: async (id) => {
          try {
               const response = await http.get(`DanhMuc/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllDanhMuc: async () => {
          try {
               const response = await http.get('DanhMuc'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default DanhMucService;