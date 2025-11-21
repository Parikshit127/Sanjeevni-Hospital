const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

async function findOrphanDoctors() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors.`);

        for (const doc of doctors) {
            const user = await User.findOne({ email: doc.email });
            if (!user) {
                console.log(`⚠️  Doctor WITHOUT User: ${doc.name} (${doc.email})`);
                // Optional: Create the user now?
            } else {
                console.log(`✅ Doctor linked to User: ${doc.name} (${doc.email}) - Role: ${user.role}`);
            }
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

findOrphanDoctors();
