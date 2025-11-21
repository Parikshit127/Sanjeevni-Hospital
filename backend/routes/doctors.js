const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// @route   GET /api/doctors
// @desc    Get all active doctors
// @access  Public
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/doctors/:id/appointments
// @desc    Get appointments for a specific doctor
// @access  Private (Doctor/Admin)
router.get("/:id/appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.id })
      .sort({ date: 1, timeSlot: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const User = require("../models/User");

// @route   POST /api/doctors
// @desc    Add new doctor (Admin only)
// @access  Private/Admin
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 2. Create User with role 'doctor'
    const userPassword = password || "password123";

    try {
      user = await User.create({
        name,
        email,
        password: userPassword,
        phone: phone || "0000000000", // Fallback if phone not provided
        role: "doctor",
      });
      console.log(`✅ Created User account for doctor: ${email}`);
    } catch (userError) {
      console.error("❌ Error creating User:", userError);
      return res.status(500).json({
        message: "Failed to create user account",
        error: userError.message
      });
    }

    // 3. Create Doctor Profile
    const doctor = await Doctor.create(req.body);
    console.log(`✅ Created Doctor profile: ${doctor.name}`);

    res.status(201).json({ success: true, doctor, user });
  } catch (error) {
    console.error("❌ Error in POST /doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Debug middleware to log ALL PUT requests
router.use((req, res, next) => {
  if (req.method === 'PUT') {
    console.log(`🔍 PUT request received: ${req.path}`);
    console.log(`   Body keys:`, Object.keys(req.body));
  }
  next();
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor (Admin only)
// @access  Private/Admin
// @route   PUT /api/doctors/:id
// @desc    Update doctor (Admin or Doctor owner)
// @access  Private
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`📝 Updating doctor ID: ${req.params.id}`);

    // 1. Find the doctor first to get the current email (to find the user)
    const currentDoctor = await Doctor.findById(req.params.id);
    if (!currentDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2. Authorization Check: Admin or Same Doctor
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.role !== "admin") {
      // If not admin, must be the doctor owner
      if (requestingUser.email !== currentDoctor.email) {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }
    }

    const { email, password, name, phone } = req.body;
    console.log(`Received update data:`, {
      email,
      password: password ? `***${password.length} chars***` : 'not provided',
      name,
      phone
    });
    console.log(`Old email: ${currentDoctor.email}, New email: ${email || 'unchanged'}`);

    // 2. Update Doctor Profile
    // Remove password from doctor update payload as it's not in Doctor schema
    const doctorUpdatePayload = { ...req.body };
    delete doctorUpdatePayload.password;
    delete doctorUpdatePayload.email; // We handle email update separately to ensure sync

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, doctorUpdatePayload, {
      new: true,
      runValidators: true,
    });

    // If email was changed in the request, update it in Doctor model too
    if (email && email !== currentDoctor.email) {
      doctor.email = email;
      await doctor.save();
    }

    console.log(`✅ Updated Doctor profile: ${doctor.name}`);

    // 3. Update Associated User
    const userEmailToFind = currentDoctor.email;
    let user = await User.findOne({ email: userEmailToFind });

    if (user) {
      console.log(`Found existing user: ${user.email}`);

      // Update fields if they are provided
      if (name) user.name = name;
      if (email && email !== currentDoctor.email) {
        console.log(`Updating email from ${user.email} to ${email}`);
        user.email = email;
      }
      if (phone) user.phone = phone;

      // Explicitly handle password update
      if (password && password.trim() !== "") {
        console.log(`Updating password for user: ${user.email}`);
        user.password = password; // Pre-save hook will hash it
      }

      await user.save();
      console.log(`✅ Updated User account: ${user.email}`);
    } else {
      // Create user if one doesn't exist
      console.log(`⚠️  No user found for ${userEmailToFind}, creating one...`);
      user = await User.create({
        name: name || currentDoctor.name,
        email: email || currentDoctor.email,
        password: password || "password123",
        phone: phone || currentDoctor.phone || "0000000000",
        role: "doctor",
      });
      console.log(`✅ Created new User account: ${user.email}`);
    }

    res.json({ success: true, doctor, user });
  } catch (error) {
    console.error("❌ Error in PUT /doctors/:id:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor (Admin only)
// @access  Private/Admin
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/doctors/appointments/:id/status
// @desc    Update appointment status (Doctor)
// @access  Private (Doctor)
router.put("/appointments/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const appointmentId = req.params.id;

    // 1. Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 2. Verify ownership (Doctor can only update their own appointments)
    // We need to find the doctor profile associated with the logged-in user
    const user = await User.findById(req.user.id);
    if (user.role !== "doctor" && user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ email: user.email });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }
      if (appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this appointment" });
      }
    }

    // 3. Update fields
    if (status) appointment.status = status;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
