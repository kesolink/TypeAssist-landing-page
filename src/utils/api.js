// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://typeassist-backend.onrender.com';

// Payment API
export const paymentAPI = {
  // Get payment info (wallet, pricing)
  async getPaymentInfo() {
    const response = await fetch(`${API_BASE_URL}/api/payment/info`);
    if (!response.ok) throw new Error('Failed to fetch payment info');
    return response.json();
  },

  // Submit payment confirmation
  async submitPayment(data) {
    const response = await fetch(`${API_BASE_URL}/api/payment/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to submit payment');
    return result;
  },

  // Check payment status
  async checkPaymentStatus(memo) {
    const response = await fetch(`${API_BASE_URL}/api/payment/status/${memo}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to check payment status');
    return result;
  },
};

// Token API
export const tokenAPI = {
  // Verify credit token
  async verifyToken(token, deviceId) {
    const response = await fetch(`${API_BASE_URL}/api/token/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, deviceId }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to verify token');
    return result;
  },

  // Check token balance
  async checkBalance(token) {
    const response = await fetch(`${API_BASE_URL}/api/token/balance/${token}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to check balance');
    return result;
  },
};
