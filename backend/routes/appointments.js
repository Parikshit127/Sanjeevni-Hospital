const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { authMiddleware } = require("../middleware/auth");

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for a doctor on a specific date
// @access  Public
router.get("/available-slots", async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ message: "Doctor ID and date are required" });
    }

    // Get doctor's available slots
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Find all booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctorId,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });

    // Extract booked time slots
    const bookedSlots = bookedAppointments.map((apt) => apt.timeSlot);

    res.json({
      success: true,
      allSlots: doctor.availableSlots,
      bookedSlots,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/appointments
// @desc    Book new appointment
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      doctorId,
      patientName,
      patientEmail,
      patientPhone,
      date,
      timeSlot,
      reason,
    } = req.body;

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    // Get doctor details for consultation fee
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorId,
      patientName,
      patientEmail,
      patientPhone,
      date: new Date(date),
      timeSlot,
      reason,
      consultationFee: doctor.consultationFee,
    });

    // Populate doctor details
    await appointment.populate("doctorId", "name specialty consultationFee");

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/appointments/my-appointments
// @desc    Get user's appointments
// @access  Private
router.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate("doctorId", "name specialty consultationFee image")
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Appointment is already cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
