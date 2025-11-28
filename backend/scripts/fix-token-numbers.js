// Script to fix token numbers for all existing appointments
require('dotenv').config();
const mongoose = require('mongoose');

async function fixTokenNumbers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const appointmentsCollection = db.collection('appointments');

        // Get all appointments sorted by doctor and date
        const appointments = await appointmentsCollection
            .find({})
            .sort({ doctorId: 1, date: 1, createdAt: 1 })
            .toArray();

        console.log(`📊 Found ${appointments.length} appointments to process`);

        // Group appointments by doctor and date
        const groupedAppts = {};

        for (const apt of appointments) {
            const doctorId = apt.doctorId.toString();
            const dateKey = new Date(apt.date).toISOString().split('T')[0]; // YYYY-MM-DD
            const key = `${doctorId}_${dateKey}`;

            if (!groupedAppts[key]) {
                groupedAppts[key] = [];
            }
            groupedAppts[key].push(apt);
        }

        let updated = 0;

        // Assign sequential token numbers for each doctor-date combination
        for (const key in groupedAppts) {
            const appts = groupedAppts[key];

            for (let i = 0; i < appts.length; i++) {
                const apt = appts[i];
                const newTokenNumber = i + 1;

                // Only update if token number is different
                if (apt.tokenNumber !== newTokenNumber) {
                    await appointmentsCollection.updateOne(
                        { _id: apt._id },
                        { $set: { tokenNumber: newTokenNumber } }
                    );
                    updated++;
                    console.log(`✅ Updated appointment ${apt._id}: Token #${newTokenNumber} (Doctor: ${apt.doctorId}, Date: ${new Date(apt.date).toLocaleDateString()})`);
                }
            }
        }

        console.log(`\n🎉 Token number fix complete! Updated ${updated} appointments`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing token numbers:', error);
        process.exit(1);
    }
}

fixTokenNumbers();
