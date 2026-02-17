# TypeAssist Admin Dashboard Guide

## Accessing the Admin Dashboard

Navigate to: **`/admin`** (e.g., `http://localhost:5173/admin` or `https://yourdomain.com/admin`)

## Login

1. You'll be prompted to enter your **Admin Secret Key**
2. This is the `ADMIN_SECRET` value from your backend `.env` file
3. The secret is stored in localStorage for convenience (logout to clear it)

## Dashboard Features

### 📊 Statistics Overview

The dashboard displays real-time stats:
- **Pending Payments** - Awaiting approval
- **Verified Payments** - Successfully approved
- **Active Tokens** - Currently active credit tokens
- **Revenue (USDT)** - Total verified payment amount

### 📋 Pending Payments List

Shows all payments waiting for approval with:
- **Memo** - Unique transaction reference code
- **Email** - Customer email address
- **Credits** - Number of credits purchased
- **Amount** - Payment amount in USDT
- **Date** - When payment was submitted

### ✅ Approving Payments

1. Click the **"Approve"** button next to a payment
2. Confirm the action
3. System will:
   - Generate a unique credit token (format: `TA-XXXXX-XXXXX-XXXXX-XXXXX`)
   - Send email to customer with their token
   - Update payment status to "verified"
   - Show success message with token details

### ❌ Rejecting Payments

1. Click the **"Reject"** button
2. Enter a reason (will be sent to customer)
3. System will:
   - Update payment status to "rejected"
   - Send rejection email with reason
   - Remove from pending list

## Backend Configuration

Make sure your backend `.env` file has:

```env
ADMIN_SECRET=your_strong_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="TypeAssist" <your.email@gmail.com>
```

## API Endpoints Used

The admin dashboard uses these backend endpoints:

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/payments/pending` - List pending payments
- `POST /api/admin/verify-payment` - Approve a payment
- `POST /api/admin/reject-payment` - Reject a payment

All requests require the `x-admin-secret` header.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Keep your admin secret safe** - Don't share it or commit it to version control
2. **Use HTTPS in production** - Never access admin dashboard over HTTP
3. **Strong passwords** - Use a strong, random admin secret (32+ characters)
4. **Logout after use** - Always logout when done, especially on shared devices
5. **Monitor access** - Check server logs regularly for unauthorized access attempts

## Troubleshooting

### "Invalid admin secret" error
- Double-check your backend `.env` file
- Make sure backend server is running
- Verify `ADMIN_SECRET` matches exactly (case-sensitive)

### Emails not sending
- Check SMTP configuration in backend `.env`
- For Gmail: Enable 2FA and create an App Password
- Check backend console logs for email errors

### Payments not loading
- Ensure backend server is running
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify MongoDB connection is working

## Quick Start

```bash
# 1. Start backend server
cd typeassist-server
node server.js

# 2. Start frontend (in new terminal)
cd TypeAssist-landing-page
npm run dev

# 3. Access admin dashboard
# Open browser: http://localhost:5173/admin
# Enter your ADMIN_SECRET from backend .env
```

---

For issues or questions, check server logs or contact support.
