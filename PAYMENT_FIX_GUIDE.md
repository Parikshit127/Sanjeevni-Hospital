# Payment Integration Fix Guide

## Current Status
✅ Razorpay SDK is installed and configured
✅ Razorpay credentials are valid (tested successfully)
✅ Payment routes are registered in server.js
✅ Frontend is configured correctly

## Issue
Getting 500 Internal Server Error when trying to create a payment order.

## Solution

### Step 1: Restart Backend Server
The code changes have been made but the server needs to restart to pick them up.

**Please do this:**
1. Stop the backend server (Ctrl+C in the terminal running `npm run dev`)
2. Restart it: `npm run dev`
3. You should see these logs:
   ```
   ✅ Razorpay instance created successfully
   ✅ MongoDB Connected
   🚀 Server running on port 5001
   ```

### Step 2: Test the Payment Endpoint
After restarting, try booking an appointment again. You should now see detailed logs:

```
📝 Creating Razorpay order...
Request data: { doctorId: '...', date: '...', timeSlot: '...', patientName: '...' }
✅ Doctor found: Dr. Name Fee: 500
Creating Razorpay order with options: { amount: 50000, currency: 'INR', receipt: '...' }
✅ Razorpay order created: order_...
```

### Step 3: If Still Getting Error
If you still get a 500 error after restart, the logs will now show:
```
❌ Error creating Razorpay order:
Error message: [exact error here]
Error stack: [full stack trace]
```

Share those logs with me and I'll fix the exact issue.

## Files Modified
1. `/backend/config/razorpay.js` - Added validation and error handling
2. `/backend/routes/payments.js` - Fixed doctorId bug, added detailed logging
3. `/backend/test-razorpay.js` - Test script to verify Razorpay works

## Quick Test
Run this in the backend directory to verify Razorpay works:
```bash
node test-razorpay.js
```

You should see:
```
✅ Test order created successfully!
🎉 Razorpay is configured correctly!
```
