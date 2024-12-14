import axios from 'axios';

// Tạo đối tượng service để xử lý các API liên quan đến thanh toán VNPay
const vnPayService = {
  async VNPayPayment(customerId, orderInfo) {
    try {
      // Gửi yêu cầu POST đến API vnpay-payment
      const response = await axios.post(
        'https://localhost:7030/vnpay-payment',
        orderInfo, 
        {
          params: {
            customerId: customerId,
          },
        }
      );

      if (response.data && response.data.paymentUrl) {
        return response.data.paymentUrl;
      }
    } catch (error) {
      console.error("VNPay Payment Error:", error);
      throw error.response?.data || "Lỗi khi gọi API thanh toán VNPay";
    }
  },
};

export default vnPayService;
