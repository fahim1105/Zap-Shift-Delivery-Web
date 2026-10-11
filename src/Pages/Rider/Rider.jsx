import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import UseAuth from '../../Hooks/UseAuth';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import { useLoaderData } from 'react-router';
import RiderIMG from '../../assets/agent-pending.png';
import Swal from 'sweetalert2';
import { FaMotorcycle, FaIdCard, FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const Rider = () => {
    const { register, handleSubmit, control, reset } = useForm();
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const serviceCenter = useLoaderData();

    const regionsDuplicate = serviceCenter.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];
    const Region = useWatch({ control, name: 'Region' });

    const districtByRegion = (region) =>
        serviceCenter.filter(c => c.region === region).map(c => c.district);

    const handleRiderApplication = (data) => {
        axiosSecure.post('/riders', data).then(res => {
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Application Submitted!",
                    text: "We'll review your application and reach out within 48 hours.",
                    icon: "success",
                    confirmButtonColor: "#CAEB66",
                    confirmButtonText: "Got it!",
                });
                reset();
            }
        });
    };

    const inputClass = "w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white";
    const selectClass = "w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white";

    return (
        <div className="w-11/12 mx-auto py-14 md:py-20">

            {/* Header */}
            <div className="mb-10">
                <span className="inline-block bg-primary text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    Rider Program
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-3">Become a ZapShift Rider</h1>
                <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
                    Earn on your schedule. Deliver parcels across your district and get paid daily. Apply now and we'll review your application within 48 hours.
                </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { emoji: "💰", label: "Daily Earnings" },
                    { emoji: "🕐", label: "Flexible Hours" },
                    { emoji: "📍", label: "Local Routes" },
                    { emoji: "🛡️", label: "Insurance Cover" },
                ].map((b, i) => (
                    <div key={i} className="bg-secondary rounded-2xl p-4 text-center">
                        <span className="text-2xl">{b.emoji}</span>
                        <p className="text-gray-200 text-xs mt-2 font-medium">{b.label}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(handleRiderApplication)} className="space-y-6">

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Form */}
                    <div className="flex-1 space-y-6">

                        {/* Personal Info */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                            <h2 className="font-bold text-secondary text-lg flex items-center gap-2">
                                <FaUser className="text-primary" /> Personal Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                                    <input type="text" {...register("Name", { required: true })} defaultValue={user?.displayName} placeholder="Your full name" className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                                    <input type="email" {...register("email", { required: true })} defaultValue={user?.email} placeholder="your@email.com" className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                                    <input type="number" {...register("yourPhone", { required: true })} placeholder="01XXXXXXXXX" className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">NID Number</label>
                                    <input type="number" {...register("yourNID", { required: true })} placeholder="National ID number" className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Region</label>
                                    <select {...register("Region", { required: true })} defaultValue="" className={selectClass}>
                                        <option value="" disabled>Pick a Region</option>
                                        {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">District</label>
                                    <select {...register("District", { required: true })} defaultValue="" className={selectClass}>
                                        <option value="" disabled>Pick a District</option>
                                        {districtByRegion(Region).map((d, i) => <option key={i} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                            <h2 className="font-bold text-secondary text-lg flex items-center gap-2">
                                <FaMotorcycle className="text-primary" /> Vehicle Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Driving License Number</label>
                                    <input type="number" {...register("drivingLicenseNumber", { required: true })} placeholder="License number" className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Bike Registration Number</label>
                                    <input type="number" {...register("bikeRegistrationNumber", { required: true })} placeholder="Registration number" className={inputClass} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Bike Brand, Model & Year</label>
                                    <input type="text" {...register("bikeBrandAndModel", { required: true })} placeholder="e.g. Honda CB Shine 2022" className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="font-bold text-secondary text-lg mb-4">Tell Us About Yourself</h2>
                            <textarea
                                {...register("aboutYourself")}
                                placeholder="Share your delivery experience, availability, or anything else we should know..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary bg-white resize-none"
                                rows={4}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn bg-secondary hover:bg-secondary/90 text-white font-bold px-12 rounded-xl w-full md:w-auto"
                        >
                            Submit Application
                        </button>
                    </div>

                    {/* Illustration */}
                    <div className="hidden lg:flex flex-col items-center gap-6 w-72 sticky top-10">
                        <img src={RiderIMG} alt="Rider" className="w-full rounded-2xl drop-shadow-xl" />
                        <div className="bg-primary rounded-2xl p-5 w-full text-center">
                            <p className="text-secondary font-bold text-sm">Average monthly earnings</p>
                            <p className="text-4xl font-extrabold text-secondary mt-1">৳25,000+</p>
                            <p className="text-secondary/60 text-xs mt-1">Based on 150+ deliveries/month</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Rider;
