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
  async handlePaymentCallback(queryParams) {
    try {
      // Gửi yêu cầu GET đến API callback với query params
      const response = await axios.get('https://localhost:7030/checkout/callback', {
        params: queryParams, // Truyền các query params nhận được từ URL
      });

      if (response.data) {
        return response.data; // Trả về kết quả nhận được từ API callback
      }
    } catch (error) {
      console.error("Payment Callback Error:", error);
      throw error.response?.data || "Lỗi khi xử lý kết quả callback VNPay";
    }
  },
};



export default vnPayService;