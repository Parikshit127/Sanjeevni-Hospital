const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        phone: "1234567890",
        role: "admin",
      });
      console.log("✅ Admin user created successfully!");
      console.log("Email:", process.env.ADMIN_EMAIL);
      console.log("Password:", process.env.ADMIN_PASSWORD);
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
