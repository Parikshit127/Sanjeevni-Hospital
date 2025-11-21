const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

async function checkUser(email) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const user = await User.findOne({ email });
        if (user) {
            console.log(`✅ User found:`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Password (Hashed): ${user.password}`);
        } else {
            console.log(`❌ User with email ${email} NOT found.`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

// Replace with the email the user tried to add
// Since I don't know the exact email, I'll list all users with role 'doctor'
async function listDoctors() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const users = await User.find({ role: "doctor" });
        console.log(`Found ${users.length} doctor users:`);
        users.forEach(u => {
            console.log(`- ${u.email} (Name: ${u.name})`);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

listDoctors();
