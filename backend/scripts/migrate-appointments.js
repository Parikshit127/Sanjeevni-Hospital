// Migration script to update existing appointments to new status system
require('dotenv').config();
const mongoose = require('mongoose');

async function migrateAppointments() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Get the Appointment collection directly to bypass validation
        const db = mongoose.connection.db;
        const appointmentsCollection = db.collection('appointments');

        // Find all appointments
        const appointments = await appointmentsCollection.find({}).toArray();
        console.log(`📊 Found ${appointments.length} total appointments`);

        let updated = 0;
        for (const apt of appointments) {
            const updates = {};

            // Update status if needed
            if (['pending', 'confirmed', 'completed'].includes(apt.status)) {
                updates.status = 'booked';
            }

            // Update paymentStatus if needed
            if (['pending', 'failed'].includes(apt.paymentStatus)) {
                updates.paymentStatus = 'paid';
            }

            // Apply updates if any
            if (Object.keys(updates).length > 0) {
                await appointmentsCollection.updateOne(
                    { _id: apt._id },
                    { $set: updates }
                );
                updated++;
                console.log(`✅ Updated appointment ${apt._id}:`, updates);
            }
        }

        console.log(`\n🎉 Migration complete! Updated ${updated} appointments`);
        console.log('All appointments now use the simplified status system (booked/cancelled) with paid status');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
}

migrateAppointments();
