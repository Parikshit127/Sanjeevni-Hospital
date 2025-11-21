const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

async function verifySystem() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const doctor = await Doctor.create({
            name: "Test Doctor",
            email: "testdoc@example.com",
            phone: "1234567890",
            specialty: "General",
            qualification: "MBBS",
            experience: 5,
            consultationFee: 500,
            startTime: "09:00",
            endTime: "11:00",
            lunchStart: "10:00",
            lunchEnd: "10:30",
            slotDuration: 15,
        });
        console.log("✅ Test Doctor Created:", doctor._id);

        const { startTime, endTime, lunchStart, lunchEnd, slotDuration } = doctor;
        let currentTime = new Date(`2000-01-01T${startTime}`);
        const endDateTime = new Date(`2000-01-01T${endTime}`);
        const lunchStartDateTime = new Date(`2000-01-01T${lunchStart}`);
        const lunchEndDateTime = new Date(`2000-01-01T${lunchEnd}`);

        console.log("\n--- Generated Slots ---");
        while (currentTime < endDateTime) {
            const timeString = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            if (currentTime >= lunchStartDateTime && currentTime < lunchEndDateTime) {
                console.log(`${timeString} (LUNCH - Skipped)`);
            } else {
                console.log(`${timeString} (Available)`);
            }
            currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
        }

        const user = await User.findOne();
        if (!user) {
            console.log("❌ No user found to test booking");
            return;
        }

        const date = new Date();
        const appointment1 = await Appointment.create({
            userId: user._id,
            doctorId: doctor._id,
            patientName: "Test Patient",
            patientEmail: "test@test.com",
            patientPhone: "123",
            date: date,
            timeSlot: "09:00",
            consultationFee: 500,
            tokenNumber: 1 
        });
        console.log("\n✅ Appointment 1 Booked. Token:", appointment1.tokenNumber);

        const count = await Appointment.countDocuments({ doctorId: doctor._id, date: date });
        const nextToken = count + 1;
        console.log(`Next Token Should Be: ${nextToken}`);

        await Doctor.findByIdAndDelete(doctor._id);
        await Appointment.findByIdAndDelete(appointment1._id);
        console.log("\n✅ Cleanup Done");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

verifySystem();
