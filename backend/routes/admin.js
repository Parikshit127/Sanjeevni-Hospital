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

// @route   GET /api/admin/analytics/operational
// @desc    Get operational metrics
// @access  Private/Admin
router.get("/analytics/operational", async (req, res) => {
  try {
    console.log("📊 Fetching operational metrics...");

    // 1. Appointments Trend (Last 30 Days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const appointmentsTrend = await Appointment.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. No-Show Rate
    const totalCompletedOrNoShow = await Appointment.countDocuments({
      status: { $in: ["completed", "cancelled"] }, // Assuming cancelled might include no-shows or we need a specific status
      // If we don't have explicit 'no-show', we might use cancelled as a proxy or just return 0 for now
    });
    // For now, let's calculate cancellation rate as a proxy for no-show if we don't have 'no-show' status
    const totalCancelled = await Appointment.countDocuments({ status: "cancelled" });
    const totalApps = await Appointment.countDocuments();
    const noShowRate = totalApps > 0 ? ((totalCancelled / totalApps) * 100).toFixed(1) : 0;

    // 3. Doctor Performance (Patients Seen)
    const doctorPerformance = await Appointment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$doctorId",
          patientsSeen: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          name: "$doctor.name",
          patientsSeen: 1,
        },
      },
      { $sort: { patientsSeen: -1 } },
      { $limit: 5 },
    ]);

    // 4. Department Load
    const departmentLoad = await Appointment.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id: "$doctor.specialty",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        appointmentsTrend,
        noShowRate,
        doctorPerformance,
        departmentLoad,
      },
    });
  } catch (error) {
    console.error("❌ Operational metrics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/admin/analytics/financial
// @desc    Get financial metrics
// @access  Private/Admin
router.get("/analytics/financial", async (req, res) => {
  try {
    console.log("💰 Fetching financial metrics...");

    // 1. Revenue Trend (Last 30 Days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const revenueTrend = await Appointment.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$consultationFee" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Top Doctors by Revenue
    const topDoctors = await Appointment.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: "$doctorId",
          revenue: { $sum: "$consultationFee" },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          name: "$doctor.name",
          revenue: 1,
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // 3. Revenue by Service Type (Specialty)
    const revenueBySpecialty = await Appointment.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id: "$doctor.specialty",
          revenue: { $sum: "$consultationFee" }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        revenueTrend,
        topDoctors,
        revenueBySpecialty,
      },
    });
  } catch (error) {
    console.error("❌ Financial metrics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/admin/patients
// @desc    Get all patients with their appointment history
// @access  Private/Admin
router.get("/patients", async (req, res) => {
  try {
    console.log("👥 Fetching all patients...");

    // 1. Find all users with role 'user'
    const patients = await User.find({ role: "user" }).select("-password");

    // 2. For each patient, get their appointment stats
    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointments = await Appointment.find({ userId: patient._id })
          .populate("doctorId", "name specialty")
          .sort({ date: -1 });

        const totalAppointments = appointments.length;
        const lastAppointment = appointments.length > 0 ? appointments[0].date : null;

        // Get unique doctors visited
        const uniqueDoctors = [
          ...new Set(
            appointments
              .filter((apt) => apt.doctorId)
              .map((apt) => apt.doctorId.name)
          ),
        ];

        return {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          totalAppointments,
          lastAppointment,
          doctorsVisited: uniqueDoctors,
        };
      })
    );

    console.log(`✅ Fetched ${patientsWithStats.length} patients`);

    res.json({
      success: true,
      data: patientsWithStats,
    });
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (Patient)
// @access  Private/Admin
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete associated appointments? 
    // For now, let's keep appointments but maybe nullify the userId or just leave them.
    // Better to delete appointments to keep DB clean or keep them for records.
    // Let's just delete the user for now as requested.

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// @route   GET /api/admin/doctors/:id/appointments
// @desc    Get all appointments for a specific doctor
// @access  Private (Admin only)
router.get('/doctors/:id/appointments', async (req, res) => {
  try {
    console.log('📋 Fetching appointments for doctor:', req.params.id);

    const appointments = await Appointment.find({ doctorId: req.params.id })
      .populate('userId', 'name email phone')
      .sort({ date: -1, timeSlot: 1 });

    console.log(`✅ Found ${appointments.length} appointments for doctor ${req.params.id}`);

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('❌ Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/doctors/:id/schedule
// @desc    Update doctor's schedule
// @access  Private (Admin only)
router.put('/doctors/:id/schedule', async (req, res) => {
  try {
    console.log('⏰ Updating schedule for doctor:', req.params.id);
    const { startTime, endTime, lunchStart, lunchEnd, slotDuration } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { startTime, endTime, lunchStart, lunchEnd, slotDuration },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    console.log('✅ Schedule updated successfully');
    res.json({ success: true, doctor });
  } catch (error) {
    console.error('❌ Error updating schedule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Admin only)
router.put('/appointments/:id/status', async (req, res) => {
  try {
    console.log('🔄 Updating appointment status:', req.params.id);
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('doctorId', 'name specialty');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log('✅ Appointment status updated to:', status);
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('❌ Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
