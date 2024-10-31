import http from "../common/http-common"; // Import http từ http-common
const GiamGiaService = {
     // Hàm tạo mới thuộc tính
     createGiamGia: async (giamGiaData) => {
          try {
               const response = await http.post('GiamGia', giamGiaData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateGiamGia: async (id, giamGiaData) => {
          try {
              const response = await http.put(`GiamGia/${id}`, giamGiaData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getGiamGiaById: async (id) => {
          try {
               const response = await http.get(`GiamGia/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllGiamGia: async () => {
          try {
               const response = await http.get('GiamGia'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default GiamGiaService;