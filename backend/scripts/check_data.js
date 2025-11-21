const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        console.log("\n--- Doctors ---");
        const doctors = await Doctor.find({});
        doctors.forEach(doc => {
            console.log(`Doctor: ${doc.name} (${doc.email})`);
            console.log(`  Start: ${doc.startTime}, End: ${doc.endTime}`);
            console.log(`  Lunch: ${doc.lunchStart}-${doc.lunchEnd}`);
            console.log(`  SlotDuration: ${doc.slotDuration}`);
            console.log(`  AvailableSlots (Old): ${doc.availableSlots ? doc.availableSlots.length : 'N/A'}`);
            console.log("-----------------------------------");
        });

        console.log("\n--- Users with Doctor Role ---");
        const doctorUsers = await User.find({ role: "doctor" });
        if (doctorUsers.length === 0) {
            console.log("❌ No users found with role 'doctor'");
        } else {
            doctorUsers.forEach(u => console.log(`User: ${u.name} (${u.email}) - Role: ${u.role}`));
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

checkData();
