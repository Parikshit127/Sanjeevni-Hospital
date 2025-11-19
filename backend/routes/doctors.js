const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
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

// @route   POST /api/doctors
// @desc    Add new doctor (Admin only)
// @access  Private/Admin
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor (Admin only)
// @access  Private/Admin
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ success: true, doctor });
  } catch (error) {
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

module.exports = router;
