const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Doctor name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  specialty: {
    type: String,
    required: [true, "Specialty is required"],
  },
  qualification: {
    type: String,
    required: [true, "Qualification is required"],
  },
  experience: {
    type: Number,
    required: [true, "Experience is required"],
    min: 0,
  },
  consultationFee: {
    type: Number,
    required: [true, "Consultation fee is required"],
    min: 0,
  },
  about: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startTime: {
    type: String,
    default: "09:00",
  },
  endTime: {
    type: String,
    default: "17:00",
  },
  lunchStart: {
    type: String,
    default: "13:00",
  },
  lunchEnd: {
    type: String,
    default: "14:00",
  },
  slotDuration: {
    type: Number,
    default: 15, // minutes
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
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
doctorSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
