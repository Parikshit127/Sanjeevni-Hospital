const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const dotenv = require("dotenv");

dotenv.config();

async function testScheduleUpdate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        // 1. Create a test doctor
        const doctor = await Doctor.create({
            name: "Schedule Tester",
            email: "scheduletest@example.com",
            phone: "1234567890",
            specialty: "Testing",
            qualification: "Test",
            experience: 5,
            consultationFee: 500,
            startTime: "09:00",
            endTime: "17:00"
        });
        console.log(`✅ Created Doctor: ${doctor._id}`);
        console.log(`   Initial Start Time: ${doctor.startTime}`);

        // 2. Simulate Update (what the PUT route does)
        const updateData = {
            startTime: "10:00",
            endTime: "18:00",
            lunchStart: "14:00",
            lunchEnd: "15:00",
            slotDuration: 30
        };

        // This mimics the logic in the PUT route
        const doctorUpdatePayload = { ...updateData };
        delete doctorUpdatePayload.password;
        delete doctorUpdatePayload.email;

        const updatedDoctor = await Doctor.findByIdAndUpdate(doctor._id, doctorUpdatePayload, {
            new: true,
            runValidators: true,
        });

        console.log(`✅ Updated Doctor:`);
        console.log(`   New Start Time: ${updatedDoctor.startTime}`);
        console.log(`   New End Time: ${updatedDoctor.endTime}`);
        console.log(`   New Slot Duration: ${updatedDoctor.slotDuration}`);

        if (updatedDoctor.startTime === "10:00" && updatedDoctor.slotDuration === 30) {
            console.log("✅ SUCCESS: Schedule fields updated correctly.");
        } else {
            console.log("❌ FAILURE: Schedule fields did NOT update.");
        }

        // Cleanup
        await Doctor.findByIdAndDelete(doctor._id);
        console.log("✅ Cleanup Done");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

testScheduleUpdate();
