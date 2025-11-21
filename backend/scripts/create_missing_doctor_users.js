const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

async function createMissingUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors.\n`);

        let created = 0;
        let skipped = 0;

        for (const doc of doctors) {
            const user = await User.findOne({ email: doc.email });
            if (!user) {
                console.log(`⚠️  Creating User for: ${doc.name} (${doc.email})`);

                // Create user with default password
                const newUser = await User.create({
                    name: doc.name,
                    email: doc.email,
                    password: "password123", // Default password
                    phone: doc.phone || "0000000000",
                    role: "doctor"
                });

                console.log(`✅ Created User: ${newUser.email} with password 'password123'\n`);
                created++;
            } else {
                console.log(`✓ User already exists: ${doc.name} (${doc.email})`);
                skipped++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Created: ${created}`);
        console.log(`   Skipped: ${skipped}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

createMissingUsers();
