const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Apply middleware to all admin routes
router.use(authMiddleware, adminMiddleware);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get("/stats", async (req, res) => {
  try {
    console.log("📊 Fetching admin stats...");

    // Total counts with error handling
    let totalPatients = 0;
    let totalDoctors = 0;
    let totalAppointments = 0;
    let todayAppointments = 0;
    let totalRevenue = 0;
    let thisMonthRevenue = 0;

    try {
      totalPatients = await User.countDocuments({ role: "user" });
      console.log("✅ Total Patients:", totalPatients);
    } catch (err) {
      console.error("❌ Error counting patients:", err.message);
    }

    try {
      totalDoctors = await Doctor.countDocuments({ isActive: true });
      console.log("✅ Total Doctors:", totalDoctors);
    } catch (err) {
      console.error("❌ Error counting doctors:", err.message);
    }

    try {
      totalAppointments = await Appointment.countDocuments();
      console.log("✅ Total Appointments:", totalAppointments);
    } catch (err) {
      console.error("❌ Error counting appointments:", err.message);
    }

    // Today's appointments
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      todayAppointments = await Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow },
      });
      console.log("✅ Today Appointments:", todayAppointments);
    } catch (err) {
      console.error("❌ Error counting today appointments:", err.message);
    }

    // Total revenue
    try {
      const revenueData = await Appointment.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$consultationFee" } } },
      ]);
      totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
      console.log("✅ Total Revenue:", totalRevenue);
    } catch (err) {
      console.error("❌ Error calculating revenue:", err.message);
    }

    // This month's revenue
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthRevenue = await Appointment.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, monthlyRevenue: { $sum: "$consultationFee" } } },
      ]);
      thisMonthRevenue =
        monthRevenue.length > 0 ? monthRevenue[0].monthlyRevenue : 0;
      console.log("✅ This Month Revenue:", thisMonthRevenue);
    } catch (err) {
      console.error("❌ Error calculating month revenue:", err.message);
    }

    const stats = {
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      totalRevenue,
      thisMonthRevenue,
    };

    console.log("✅ Stats sent successfully:", stats);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("❌ Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
      error: error.message,
    });
  }
});

// @route   GET /api/admin/appointments-chart
// @desc    Get appointments data for charts (last 7 days)
// @access  Private/Admin
router.get("/appointments-chart", async (req, res) => {
  try {
    console.log("📈 Fetching appointments chart data...");

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const appointmentsByDay = await Appointment.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("✅ Appointments chart data:", appointmentsByDay);

    res.json({ success: true, data: appointmentsByDay });
  } catch (error) {
    console.error("❌ Appointments chart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chart data",
      error: error.message,
      data: [], // Return empty array to prevent frontend crash
    });
  }
});

// @route   GET /api/admin/revenue-chart
// @desc    Get revenue data for charts (last 6 months)
// @access  Private/Admin
router.get("/revenue-chart", async (req, res) => {
  try {
    console.log("💰 Fetching revenue chart data...");

    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);

    const revenueByMonth = await Appointment.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: last6Months },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$consultationFee" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("✅ Revenue chart data:", revenueByMonth);

    res.json({ success: true, data: revenueByMonth });
  } catch (error) {
    console.error("❌ Revenue chart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching revenue data",
      error: error.message,
      data: [], // Return empty array to prevent frontend crash
    });
  }
});

// @route   GET /api/admin/appointments
// @desc    Get all appointments
// @access  Private/Admin
router.get("/appointments", async (req, res) => {
  try {
    console.log("📋 Fetching all appointments...");

    const appointments = await Appointment.find()
      .populate("userId", "name email phone")
      .populate("doctorId", "name specialty")
      .sort({ date: -1 });

    console.log("✅ Appointments fetched:", appointments.length);

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("❌ Appointments fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
      error: error.message,
      appointments: [], // Return empty array
    });
  }
});

// @route   PUT /api/admin/appointments/:id/status
// @desc    Update appointment status
// @access  Private/Admin
router.put("/appointments/:id/status", async (req, res) => {
  try {
    console.log("🔄 Updating appointment status:", req.params.id);

    const { status, paymentStatus } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    ).populate("doctorId userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    console.log("✅ Appointment updated successfully");

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("❌ Appointment update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating appointment",
      error: error.message,
    });
  }
});

// @route   GET /api/admin/all-doctors
// @desc    Get all doctors (including inactive)
// @access  Private/Admin
router.get("/all-doctors", async (req, res) => {
  try {
    console.log("👨‍⚕️ Fetching all doctors...");

    const doctors = await Doctor.find().sort({ createdAt: -1 });

    console.log("✅ Doctors fetched:", doctors.length);

    res.json({ success: true, doctors });
  } catch (error) {
    console.error("❌ Doctors fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching doctors",
      error: error.message,
      doctors: [], // Return empty array
    });
  }
});

module.exports = router;
