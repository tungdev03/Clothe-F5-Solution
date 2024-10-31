import http from "../common/http-common"; // Import http từ http-common
const ChatLieuService = {
     // Hàm tạo mới thuộc tính
     createChatLieu: async (chatLieuData) => {
          try {
               const response = await http.post('ChatLieu', chatLieuData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateChatLieu: async (id, chatLieuData) => {
          try {
              const response = await http.put(`ChatLieu/${id}`, chatLieuData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getChatLieuById: async (id) => {
          try {
               const response = await http.get(`ChatLieu/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
     
     // Hàm lấy danh sách tất cả các Chất liệu
     getAllChatLieu: async () => {
          try {
               const response = await http.get('ChatLieu'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default ChatLieuService;