/*
  Script: clean_appointments.js
  Purpose: Find and optionally delete "null" or placeholder appointments from the database.
  Usage:
    # Dry run (no deletes):
    node backend/scripts/clean_appointments.js --dry

    # Actual delete:
    node backend/scripts/clean_appointments.js

  Note: This script uses MONGODB_URI from your backend .env file.
*/

const mongoose = require('mongoose');
require('dotenv').config();
const Appointment = require('../models/Appointment');

const DRY_RUN = process.argv.includes('--dry') || process.argv.includes('--dry-run');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment. Please set it in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Define conditions that indicate a mock / null / placeholder appointment
  const conditions = [
    { doctorId: null },
    { doctorId: { $exists: false } },
    { userId: null },
    { userId: { $exists: false } },
    { patientName: { $in: [null, ''] } },
    { patientEmail: { $in: [null, ''] } },
    { patientPhone: { $in: [null, ''] } },
    { timeSlot: { $in: [null, ''] } },
    { date: { $exists: false } },
    // Example: placeholder images or dummy flags - adapt if your data uses a specific flag
    { 'doctorId.image': { $regex: 'placeholder', $options: 'i' } },
  ];

  const query = { $or: conditions };

  const matches = await Appointment.find(query).limit(100).lean();
  console.log(`Found ${matches.length} matched appointments (showing up to 100).`);
  if (matches.length > 0) {
    matches.forEach((m) => {
      console.log(`- id=${m._id} userId=${m.userId} doctorId=${m.doctorId} patientName='${m.patientName}' timeSlot='${m.timeSlot}' date='${m.date}'`);
    });
  }

  if (DRY_RUN) {
    console.log('\nDry run mode enabled — no deletions performed.');
  } else {
    const { deletedCount } = await Appointment.deleteMany(query);
    console.log(`\nDeleted ${deletedCount} appointments.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
