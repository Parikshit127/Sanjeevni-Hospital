const dotenv = require("dotenv");
// Load environment variables FIRST before any other imports
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import Routes (after dotenv is configured)
const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const adminRoutes = require("./routes/admin");
const paymentsRoutes = require("./routes/payments");
const uploadRoutes = require("./routes/upload");

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      // Add your Vercel deployment URL here after deployment
      // 'https://sanjivani-hospital.vercel.app',
      // 'https://your-custom-domain.com'
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const User = require("./models/User");

async function ensureAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      phone: "1234567890",
      role: "admin",
    });
    console.log("🔥 Admin created on Render");
  } else {
    console.log("ℹ️ Admin already exists on Render");
  }
}

ensureAdmin();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/upload", uploadRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Sanjivani Hospital API is running!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
