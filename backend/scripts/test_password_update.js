const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

async function testPasswordUpdate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        // Find the user
        const email = "akarsh@gmail.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return;
        }

        console.log(`Found user: ${user.name} (${user.email})`);
        console.log(`Current password hash: ${user.password.substring(0, 20)}...`);

        // Update password
        const newPassword = "akarsh";
        console.log(`\nSetting new password: "${newPassword}"`);
        user.password = newPassword;

        await user.save();

        console.log(`\n✅ Password updated!`);
        console.log(`New password hash: ${user.password.substring(0, 20)}...`);

        // Test if the password works
        const isMatch = await user.comparePassword(newPassword);
        console.log(`\nPassword verification: ${isMatch ? '✅ WORKS' : '❌ FAILED'}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

testPasswordUpdate();
