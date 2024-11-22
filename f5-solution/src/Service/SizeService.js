import http from "../common/http-common"; // Import http từ http-common
const SizeService = {
     // Hàm tạo mới thuộc tính
     createSize: async (sizeData) => {
          try {
               const response = await http.post('Size', sizeData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateSize: async (id, sizeData) => {
          try {
              const response = await http.put(`Size/${id}`, sizeData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getSizeById: async (id) => {
          try {
               const response = await http.get(`Size/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllSize: async () => {
          try {
               const response = await http.get('Size'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default SizeService;