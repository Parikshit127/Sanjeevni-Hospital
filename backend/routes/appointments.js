const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
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

    // Get doctor's schedule details
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

    // Generate available slots
    const { startTime, endTime, lunchStart, lunchEnd, slotDuration } = doctor;

    console.log(`📅 Generating slots for Dr. ${doctor.name} on ${date}`);
    console.log(`   Schedule: ${startTime}-${endTime}, Lunch: ${lunchStart}-${lunchEnd}, Duration: ${slotDuration}`);

    // Safety check for slotDuration
    const duration = slotDuration && slotDuration > 0 ? slotDuration : 15;

    const slots = [];

    // Helper to parse time string "HH:mm" to Date object on 2000-01-01
    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      const d = new Date(`2000-01-01T${timeStr}`);
      return isNaN(d.getTime()) ? null : d;
    };

    let currentTime = parseTime(startTime);
    const endDateTime = parseTime(endTime);
    const lunchStartDateTime = parseTime(lunchStart);
    const lunchEndDateTime = parseTime(lunchEnd);

    if (!currentTime || !endDateTime) {
      console.error("❌ Invalid start or end time for doctor");
      return res.status(500).json({ message: "Invalid doctor schedule configuration" });
    }

    while (currentTime < endDateTime) {
      // Format current time to HH:mm
      const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Check if current time is within lunch break
      if (lunchStartDateTime && lunchEndDateTime) {
        if (currentTime >= lunchStartDateTime && currentTime < lunchEndDateTime) {
          // console.log(`   Skipping lunch slot: ${timeString}`);
          currentTime.setMinutes(currentTime.getMinutes() + duration);
          continue;
        }
      }

      // Check if slot is in the past (only for today)
      const slotDate = new Date(date);
      const now = new Date();

      // Reset time components for date comparison
      const isToday = slotDate.getDate() === now.getDate() &&
        slotDate.getMonth() === now.getMonth() &&
        slotDate.getFullYear() === now.getFullYear();

      if (isToday) {
        // Create a date object for the slot time on the current day
        const slotTimeOnDate = new Date(now);
        slotTimeOnDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);

        // If slot time is before now, skip it
        if (slotTimeOnDate < now) {
          currentTime.setMinutes(currentTime.getMinutes() + duration);
          continue;
        }
      }

      // Add to slots if not booked
      if (!bookedSlots.includes(timeString)) {
        slots.push(timeString);
      }

      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    res.json({
      success: true,
      allSlots: slots, // Sending only available slots as 'allSlots' for frontend compatibility or update frontend to use this
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

    // Check if patient already has an appointment with this doctor on this date
    const existingPatientAppointment = await Appointment.findOne({
      userId: req.user.id,
      doctorId,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });

    if (existingPatientAppointment) {
      return res
        .status(400)
        .json({ message: "You already have an appointment with this doctor on this date" });
    }

    // Check if slot is already booked
    const existingSlot = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingSlot) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    // Get doctor details for consultation fee
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Generate Token Number
    // Count existing appointments for this doctor on this date to assign next token
    const appointmentCount = await Appointment.countDocuments({
      doctorId,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });
    const tokenNumber = appointmentCount + 1;

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
      tokenNumber,
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

// @route   PUT /api/appointments/:id/reschedule
// @desc    Reschedule appointment to new date/time
// @access  Private
router.put("/:id/reschedule", authMiddleware, async (req, res) => {
  try {
    const { newDate, newTimeSlot } = req.body;

    if (!newDate || !newTimeSlot) {
      return res.status(400).json({ message: "New date and time slot are required" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "cancelled" || appointment.status === "completed") {
      return res
        .status(400).json({
          message: `Cannot reschedule ${appointment.status} appointment`
        });
    }

    // Check if new slot is available
    const existingSlot = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date: new Date(newDate),
      timeSlot: newTimeSlot,
      status: { $ne: "cancelled" },
      _id: { $ne: appointment._id }, // Exclude current appointment
    });

    if (existingSlot) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    // Update appointment
    appointment.date = new Date(newDate);
    appointment.timeSlot = newTimeSlot;
    await appointment.save();

    await appointment.populate("doctorId", "name specialty consultationFee image");

    res.json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Permanently delete appointment
// @access  Private (Admin or Doctor owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Authorization: Admin or the Doctor who owns the appointment
    const user = await User.findById(req.user.id);

    if (user.role !== 'admin') {
      if (user.role === 'doctor') {
        const doctor = await Doctor.findOne({ email: user.email });
        if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
          return res.status(403).json({ message: "Not authorized to delete this appointment" });
        }
      } else {
        // Regular users shouldn't delete? Or maybe they can? 
        // Requirement says "remove the patients also so that it doesnt get clustered in both admin and doctors dashboards"
        // Implies Admin/Doctor action.
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Appointment deleted permanently" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
