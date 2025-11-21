const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const dotenv = require("dotenv");

// So we will simulate the logic directly

dotenv.config();

async function testSlotGeneration() {
    // Simulate the logic from appointments.js
    const startTime = "09:00";
    const endTime = "17:00";
    const lunchStart = "13:00";
    const lunchEnd = "14:00";
    const slotDuration = 15;

    console.log(`--- Configuration ---`);
    console.log(`Start: ${startTime}, End: ${endTime}`);
    console.log(`Lunch: ${lunchStart} - ${lunchEnd}`);
    console.log(`Duration: ${slotDuration} min`);

    const slots = [];
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const endDateTime = new Date(`2000-01-01T${endTime}`);
    const lunchStartDateTime = new Date(`2000-01-01T${lunchStart}`);
    const lunchEndDateTime = new Date(`2000-01-01T${lunchEnd}`);

    console.log(`\n--- Generating Slots ---`);
    while (currentTime < endDateTime) {
        const timeString = currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        let status = "Available";

        // Check Lunch
        if (currentTime >= lunchStartDateTime && currentTime < lunchEndDateTime) {
            status = "LUNCH (Skipped)";
            console.log(`${timeString} : ${status}`);
            currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
            continue;
        }

        console.log(`${timeString} : ${status}`);
        slots.push(timeString);
        currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    console.log(`\nTotal Available Slots: ${slots.length}`);

    // Check specific cases
    if (slots.includes("13:00")) console.log("❌ ERROR: 13:00 (Lunch Start) is included!");
    else console.log("✅ 13:00 is correctly excluded.");

    if (slots.includes("13:45")) console.log("❌ ERROR: 13:45 (Lunch) is included!");
    else console.log("✅ 13:45 is correctly excluded.");

    if (slots.includes("14:00")) console.log("✅ 14:00 (Lunch End) is included.");
    else console.log("❌ ERROR: 14:00 should be included!");

}

testSlotGeneration();
