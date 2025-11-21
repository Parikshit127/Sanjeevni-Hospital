const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

async function setDoctorRole() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const email = "parikshitkaushal0712@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            user.role = "doctor";
            await user.save();
            console.log(`✅ Updated user ${user.name} (${user.email}) to role 'doctor'`);
        } else {
            console.log(`❌ User with email ${email} not found. Creating one...`);
            // Create a default doctor user if not exists
            const newUser = await User.create({
                name: "Dr. Parikshit",
                email: email,
                password: "password123", // Default password
                phone: "1234567890",
                role: "doctor"
            });
            console.log(`✅ Created new user ${newUser.name} with role 'doctor' and password 'password123'`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

setDoctorRole();
