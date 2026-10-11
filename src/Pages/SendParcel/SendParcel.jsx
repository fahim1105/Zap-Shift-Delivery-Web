import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import UseAuth from "../../Hooks/UseAuth";
import { FaBoxOpen, FaUser, FaPhone, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";

const InputField = ({ label, icon: Icon, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className={`flex items-center gap-2 border rounded-xl px-3 h-11 bg-white transition-all focus-within:ring-2 focus-within:ring-primary ${error ? 'border-red-400' : 'border-gray-200'}`}>
            {Icon && <Icon className="text-gray-400 flex-shrink-0 text-sm" />}
            {children}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const SendParcel = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const serviceCenter = useLoaderData();

    const regionsDuplicate = serviceCenter.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];

    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });

    const districtByRegion = (region) =>
        serviceCenter.filter(c => c.region === region).map(c => c.district);

    const onSubmit = (data) => {
        const isDocument = data.parcelType === "Document";
        const isSameDistrict = data.receiverDistrict === data.senderDistrict;
        const parcelWeight = parseFloat(data.parcelWeight);

        let cost = 0;
        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
        } else {
            if (parcelWeight <= 3) {
                cost = isSameDistrict ? 110 : 150;
            } else {
                const minCharge = isSameDistrict ? 110 : 150;
                const extraWeight = parcelWeight - 3;
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;
                cost = minCharge + extraCharge;
            }
        }
        data.cost = cost;

        Swal.fire({
            title: "Confirm Delivery Cost",
            html: `
                <p class="text-gray-600 mb-2">Estimated delivery charge:</p>
                <h2 class="text-4xl font-extrabold text-secondary">৳${cost}</h2>
                <p class="text-xs text-gray-400 mt-2">${isSameDistrict ? 'Same district' : 'Inter-district'} · ${isDocument ? 'Document' : `${parcelWeight} kg`}</p>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Confirm & Proceed",
            cancelButtonText: "Cancel",
            buttonsStyling: false,
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "bg-primary hover:bg-primary/90 text-accent font-bold px-6 py-3 rounded-xl mx-2",
                cancelButton: "bg-gray-200 hover:bg-gray-300 text-accent font-bold px-6 py-3 rounded-xl mx-2",
            }
        }).then((result) => {
            if (!result.isConfirmed) return;

            Swal.fire({
                title: "Processing...",
                text: "Please wait while we confirm your booking.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading()
            });

            axiosSecure.post('parcels', data).then(res => {
                if (res.data.insertedId) {
                    navigate("/dashboard/my-parcels");
                    setTimeout(() => {
                        Swal.fire({
                            title: "Booking Confirmed!",
                            text: "Your parcel has been booked. Please complete payment.",
                            icon: "success",
                            confirmButtonColor: "#CAEB66",
                            confirmButtonText: "Go to My Parcels",
                        });
                    }, 1500);
                }
            });
        });
    };

    const selectClass = "grow outline-none bg-transparent text-sm text-gray-700";
    const inputClass = "grow outline-none bg-transparent text-sm placeholder:text-gray-400";

    return (
        <div className="w-11/12 mx-auto py-14 md:py-20">

            {/* Header */}
            <div className="mb-10">
                <span className="inline-block bg-primary text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    New Booking
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-secondary mb-2">Send a Parcel</h1>
                <p className="text-gray-500 text-sm md:text-base">Fill in the details below. Pickup is between 4pm – 7pm.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Parcel Type + Info */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="font-bold text-secondary text-lg mb-5 flex items-center gap-2">
                        <FaBoxOpen className="text-primary" /> Parcel Details
                    </h2>

                    {/* Parcel Type */}
                    <div className="flex gap-6 mb-6">
                        {["Document", "Non-Document"].map(type => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    {...register("parcelType")}
                                    value={type}
                                    className="w-4 h-4 accent-secondary"
                                />
                                <span className="text-sm font-medium text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField label="Parcel Name" icon={FaBoxOpen} error={errors.parcelName?.message}>
                            <input
                                type="text"
                                placeholder="e.g. Laptop, Documents..."
                                {...register("parcelName", { required: "Parcel name is required" })}
                                className={inputClass}
                            />
                        </InputField>
                        <InputField label="Parcel Weight (KG)" error={errors.parcelWeight?.message}>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 1.5"
                                {...register("parcelWeight", { required: "Weight is required" })}
                                className={inputClass}
                            />
                        </InputField>
                    </div>
                </div>

                {/* Sender & Receiver */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Sender */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                        <h2 className="font-bold text-secondary text-lg flex items-center gap-2">
                            <FaUser className="text-primary" /> Sender Details
                        </h2>

                        <InputField label="Sender Name" icon={FaUser}>
                            <input type="text" placeholder="Full Name" {...register("senderName", { required: true })} defaultValue={user?.displayName} className={inputClass} />
                        </InputField>
                        <InputField label="Sender Email">
                            <input type="email" placeholder="Email" {...register("senderEmail", { required: true })} defaultValue={user?.email} className={inputClass} />
                        </InputField>
                        <InputField label="Address" icon={FaMapMarkerAlt}>
                            <input type="text" placeholder="Street / Area" {...register("senderAddress", { required: true })} className={inputClass} />
                        </InputField>
                        <InputField label="Phone Number" icon={FaPhone}>
                            <input type="text" placeholder="01XXXXXXXXX" {...register("senderPhone", { required: true })} className={inputClass} />
                        </InputField>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                            <select {...register("senderRegion", { required: true })} defaultValue="" className="w-full border border-gray-200 rounded-xl px-3 h-11 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary bg-white">
                                <option value="" disabled>Pick a Region</option>
                                {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <select {...register("senderDistrict", { required: true })} defaultValue="" className="w-full border border-gray-200 rounded-xl px-3 h-11 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary bg-white">
                                <option value="" disabled>Pick a District</option>
                                {districtByRegion(senderRegion).map((d, i) => <option key={i} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Instruction</label>
                            <textarea
                                placeholder="Any special pickup notes..."
                                {...register("pickupInstruction")}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary bg-white resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Receiver */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                        <h2 className="font-bold text-secondary text-lg flex items-center gap-2">
                            <FaUser className="text-primary" /> Receiver Details
                        </h2>

                        <InputField label="Receiver Name" icon={FaUser}>
                            <input type="text" placeholder="Full Name" {...register("receiverName", { required: true })} className={inputClass} />
                        </InputField>
                        <InputField label="Receiver Email">
                            <input type="email" placeholder="Email" {...register("receiverEmail", { required: true })} className={inputClass} />
                        </InputField>
                        <InputField label="Receiver Address" icon={FaMapMarkerAlt}>
                            <input type="text" placeholder="Street / Area" {...register("receiverAddress", { required: true })} className={inputClass} />
                        </InputField>
                        <InputField label="Receiver Phone" icon={FaPhone}>
                            <input type="text" placeholder="01XXXXXXXXX" {...register("receiverPhone", { required: true })} className={inputClass} />
                        </InputField>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                            <select {...register("receiverRegion", { required: true })} defaultValue="" className="w-full border border-gray-200 rounded-xl px-3 h-11 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary bg-white">
                                <option value="" disabled>Pick a Region</option>
                                {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <select {...register("receiverDistrict", { required: true })} defaultValue="" className="w-full border border-gray-200 rounded-xl px-3 h-11 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary bg-white">
                                <option value="" disabled>Pick a District</option>
                                {districtByRegion(receiverRegion).map((d, i) => <option key={i} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instruction</label>
                            <textarea
                                placeholder="Any special delivery notes..."
                                {...register("deliveryInstruction")}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary bg-white resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Note + Submit */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-primary/10 border border-primary/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <FaFileAlt className="text-secondary flex-shrink-0" />
                        <span>Pickup time: <strong>4:00 PM – 7:00 PM</strong>. Make sure someone is available at the pickup address.</span>
                    </div>
                    <button
                        type="submit"
                        className="btn bg-secondary text-white hover:bg-secondary/90 px-10 rounded-xl font-bold whitespace-nowrap"
                    >
                        Confirm Booking
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendParcel;
