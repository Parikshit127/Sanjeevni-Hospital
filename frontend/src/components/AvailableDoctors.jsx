import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaStar, FaCalendarAlt, FaStethoscope, FaAward, FaArrowRight } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function AvailableDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch(`${API_URL}/doctors`);
                const data = await res.json();
                setDoctors(data.doctors?.slice(0, 4) || []); // Show first 4 doctors
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading our specialists...</p>
                </div>
            </section>
        );
    }

    if (doctors.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="bg-white p-12 rounded-2xl shadow-lg max-w-md mx-auto">
                        <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No doctors available at the moment.</p>
                        <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-20 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16 space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold">
                            <FaStethoscope />
                            <span>Our Medical Team</span>
                        </span>
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-bold">
                        <span className="text-slate-800">Meet Our </span>
                        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            Expert Doctors
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Book an appointment with our experienced specialists dedicated to your orthopedic health
                    </p>
                </motion.div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctors.map((doctor, index) => (
                        <motion.div
                            key={doctor._id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                {/* Doctor Image */}
                                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50">
                                    {doctor.image ? (
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaUserMd className="text-7xl text-teal-300 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    )}
                                    
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Badge */}
                                    {doctor.rating && (
                                        <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                            <FaStar className="text-yellow-400 text-sm" />
                                            <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Doctor Info */}
                                <div className="p-6 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-teal-600 font-semibold text-sm mt-1 flex items-center gap-2">
                                            <FaStethoscope className="text-xs" />
                                            {doctor.specialty}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <FaStar className="text-yellow-400 text-sm" />
                                            <span className="text-sm font-medium">
                                                {doctor.rating || "New"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {doctor.totalReviews || 0} reviews
                                        </div>
                                    </div>

                                    {/* Experience Badge */}
                                    {doctor.experience && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-slate-50 px-3 py-2 rounded-lg">
                                            <FaAward className="text-teal-600" />
                                            <span className="font-medium">{doctor.experience} years exp.</span>
                                        </div>
                                    )}

                                    {/* Book Button */}
                                    <Link
                                        to={`/book-appointment/${doctor._id}`}
                                        className="group/btn flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        <FaCalendarAlt className="group-hover/btn:scale-110 transition-transform" />
                                        <span>Book Appointment</span>
                                        <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* Decorative gradient line */}
                                <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <Link
                        to="/doctors"
                        className="group inline-flex items-center gap-3 bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span>View All Doctors</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { icon: <FaUserMd />, label: 'Experienced Specialists', desc: 'Board-certified doctors' },
                        { icon: <FaCalendarAlt />, label: 'Easy Booking', desc: 'Online appointment system' },
                        { icon: <FaAward />, label: 'Quality Care', desc: '98% patient satisfaction' }
                    ].map((item, idx) => (
                        <div 
                            key={idx}
                            className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
                                <p className="text-gray-600 text-xs">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}