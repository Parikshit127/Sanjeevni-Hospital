const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  tokenNumber: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked", // Default to booked since payment is required
  },
  paymentStatus: {
    type: String,
    enum: ["paid"], // Only paid appointments are created
    default: "paid",
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  reason: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
