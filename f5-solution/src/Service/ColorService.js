import http from "../common/http-common"; // Import http từ http-common
const ColorService = {
     // Hàm tạo mới thuộc tính
     createColor: async (colorData) => {
          try {
               const response = await http.post('MauSac', colorData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateColor: async (id, colorData) => {
          try {
              const response = await http.put(`MauSac/${id}`, colorData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getColorById: async (id) => {
          try {
               const response = await http.get(`MauSac/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllColor: async () => {
          try {
               const response = await http.get('MauSac'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default ColorService;