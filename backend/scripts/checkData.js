const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const doctors = await Doctor.find();
        console.log('Doctors:', doctors.map(d => ({ name: d.name, id: d._id })));

        const appointments = await Appointment.find();
        console.log('Total Appointments:', appointments.length);
        console.log('Appointments:', appointments.map(a => ({
            id: a._id,
            doctorId: a.doctorId,
            patient: a.patientName
        })));

        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkData();
