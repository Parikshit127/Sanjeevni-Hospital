const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sampleDoctors = [
    {
        name: 'Dr. S.S. Chauhan',
        specialty: 'Orthopedic Surgeon',
        email: 'dr.chauhan@sanjivani.com',
        phone: '9876543210',
        experience: 25,
        consultationFee: 500,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        startTime: '09:00',
        endTime: '18:00',
        lunchStart: '13:00',
        lunchEnd: '14:00',
        slotDuration: 15,
        rating: 4.8,
        totalReviews: 250
    },
    {
        name: 'Dr. Rajesh Kumar',
        specialty: 'Joint Replacement Specialist',
        email: 'dr.rajesh@sanjivani.com',
        phone: '9876543211',
        experience: 15,
        consultationFee: 600,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        startTime: '10:00',
        endTime: '19:00',
        lunchStart: '14:00',
        lunchEnd: '15:00',
        slotDuration: 20,
        rating: 4.7,
        totalReviews: 180
    },
    {
        name: 'Dr. Priya Sharma',
        specialty: 'Sports Medicine',
        email: 'dr.priya@sanjivani.com',
        phone: '9876543212',
        experience: 12,
        consultationFee: 550,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        startTime: '09:00',
        endTime: '17:00',
        lunchStart: '13:00',
        lunchEnd: '14:00',
        slotDuration: 15,
        rating: 4.9,
        totalReviews: 200
    },
    {
        name: 'Dr. Amit Verma',
        specialty: 'Spine Surgeon',
        email: 'dr.amit@sanjivani.com',
        phone: '9876543213',
        experience: 18,
        consultationFee: 700,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        startTime: '10:00',
        endTime: '18:00',
        lunchStart: '13:30',
        lunchEnd: '14:30',
        slotDuration: 20,
        rating: 4.6,
        totalReviews: 150
    }
];

async function seedDoctors() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB');

        // Check if doctors already exist
        const existingDoctors = await Doctor.find();
        console.log(`📊 Found ${existingDoctors.length} existing doctors`);

        if (existingDoctors.length === 0) {
            await Doctor.insertMany(sampleDoctors);
            console.log('✅ Sample doctors added successfully!');
        } else {
            console.log('ℹ️  Doctors already exist in database');
            console.log('Doctor names:', existingDoctors.map(d => d.name).join(', '));
        }

        const allDoctors = await Doctor.find();
        console.log(`\n📋 Total doctors in database: ${allDoctors.length}`);

        mongoose.connection.close();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding doctors:', error);
        process.exit(1);
    }
}

seedDoctors();
