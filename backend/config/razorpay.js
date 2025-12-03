const Razorpay = require("razorpay");

// Validate Razorpay credentials
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in .env file!");
  console.error("Please add these credentials to your .env file:");
  console.error("RAZORPAY_KEY_ID=your_key_id");
  console.error("RAZORPAY_KEY_SECRET=your_key_secret");
}

let razorpayInstance;

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay instance created successfully");
} catch (error) {
  console.error("❌ Error creating Razorpay instance:", error.message);
  throw error;
}

module.exports = razorpayInstance;
