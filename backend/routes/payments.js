// routes/payments.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const razorpay = require("../config/razorpay");   // we'll create this next
const { authMiddleware } = require("../middleware/auth");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// 🧪 Test endpoint to verify payment routes are working
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Payment routes are working!",
        razorpayConfigured: !!(razorpay && razorpay.orders),
        envVars: {
            hasKeyId: !!process.env.RAZORPAY_KEY_ID,
            hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET
        }
    });
});


// 🔹 Create Razorpay order
// POST /api/payments/create-order
router.post("/create-order", authMiddleware, async (req, res) => {
    try {
        console.log("📝 Creating Razorpay order...");

        // Validate razorpay instance
        if (!razorpay || !razorpay.orders) {
            console.error("❌ Razorpay instance not properly initialized");
            return res.status(500).json({
                message: "Payment gateway not configured properly. Please contact support."
            });
        }

        const {
            doctorId,
            date,
            timeSlot,
            reason,
            patientName,
            patientEmail,
            patientPhone,
        } = req.body;

        console.log("Request data:", { doctorId, date, timeSlot, patientName });

        if (!doctorId || !date || !timeSlot) {
            console.error("❌ Missing required fields");
            return res
                .status(400)
                .json({ message: "Doctor, date and time slot are required" });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            console.error("❌ Doctor not found:", doctorId);
            return res.status(404).json({ message: "Doctor not found" });
        }

        console.log("✅ Doctor found:", doctor.name, "Fee:", doctor.consultationFee);

        const amount = doctor.consultationFee * 100; // amount in paise

        // Convert doctorId to string if it's an ObjectId
        const doctorIdStr = doctorId.toString();

        const options = {
            amount,
            currency: "INR",
            receipt: `apt_${doctorIdStr.slice(-8)}_${Date.now()}`,
            notes: {
                doctorId: doctorIdStr,
                date,
                timeSlot,
                userId: req.user.id,
                patientName,
                patientEmail,
                patientPhone,
                reason,
            },
        };

        console.log("Creating Razorpay order with options:", { amount, currency: "INR", receipt: options.receipt });
        const order = await razorpay.orders.create(options);
        console.log("✅ Razorpay order created:", order.id);

        res.json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            amount,
            currency: "INR",
            orderId: order.id,
        });
    } catch (error) {
        console.error("❌ Error creating Razorpay order:");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Error details:", error);
        res.status(500).json({
            message: "Failed to create payment order",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 🔹 Verify payment + create appointment
// POST /api/payments/verify-and-create
router.post("/verify-and-create", authMiddleware, async (req, res) => {
    try {
        console.log("🔍 Verifying payment and creating appointment...");
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            appointmentData,
        } = req.body;

        console.log("Payment data received:", {
            razorpay_order_id,
            razorpay_payment_id,
            hasSignature: !!razorpay_signature,
            hasAppointmentData: !!appointmentData
        });

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !appointmentData
        ) {
            console.error("❌ Incomplete payment data");
            return res.status(400).json({ message: "Incomplete payment data" });
        }

        console.log("Verifying signature...");
        const signString = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(signString)
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            console.error("❌ Invalid payment signature");
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        console.log("✅ Payment signature verified");

        const {
            doctorId,
            patientName,
            patientEmail,
            patientPhone,
            date,
            timeSlot,
            reason,
        } = appointmentData;

        // Same logic as your POST /api/appointments route:
        const existingPatientAppointment = await Appointment.findOne({
            userId: req.user.id,
            doctorId,
            date: new Date(date),
            status: { $ne: "cancelled" },
        });

        if (existingPatientAppointment) {
            return res.status(400).json({
                message:
                    "You already have an appointment with this doctor on this date",
            });
        }

        const existingSlot = await Appointment.findOne({
            doctorId,
            date: new Date(date),
            timeSlot,
            status: { $ne: "cancelled" },
        });

        if (existingSlot) {
            return res.status(400).json({ message: "This time slot is already booked" });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const appointmentCount = await Appointment.countDocuments({
            doctorId,
            date: new Date(date),
            status: { $ne: "cancelled" },
        });

        const tokenNumber = appointmentCount + 1;

        console.log("Creating appointment...");
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
            paymentStatus: "paid",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        });

        console.log("✅ Appointment created:", appointment._id);

        await appointment.populate("doctorId", "name specialty consultationFee image");

        console.log("✅ Payment verified and appointment created successfully");
        res.json({ success: true, appointment });
    } catch (error) {
        console.error("❌ Error verifying payment / creating appointment:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
