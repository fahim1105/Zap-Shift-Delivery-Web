import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams, Link } from 'react-router';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loader from '../../../Component/Loader/Loader';
import { FaBoxOpen, FaMoneyBillWave, FaLock } from 'react-icons/fa';

const Payment = () => {
    const { parcelId } = useParams();
    const axiosSecure = UseAxiosSecure();

    const { data: parcel, isLoading } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    const handlePayment = async () => {
        const paymentInfo = {
            cost: parcel.cost,
            parcelName: parcel.parcelName,
            senderEmail: parcel.senderEmail,
            parcelId: parcel._id
        };
        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        window.location.href = res.data.url;
    };

    if (isLoading) return <Loader />;

    return (
        <div className="p-4 md:p-8 flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md">

                <h1 className="text-2xl font-bold text-secondary mb-2">Complete Payment</h1>
                <p className="text-gray-500 text-sm mb-8">Review your parcel details and proceed to secure checkout.</p>

                {/* Parcel summary card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                            <FaBoxOpen className="text-secondary" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Parcel</p>
                            <p className="font-bold text-secondary">{parcel?.parcelName}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Delivery Status</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                            {parcel?.deliveryStatus}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Tracking ID</span>
                        <span className="font-mono text-xs text-secondary">{parcel?.trackingId || '—'}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                        <span className="text-2xl font-extrabold text-secondary">৳{parcel?.cost}</span>
                    </div>
                </div>

                {/* Secure badge */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                    <FaLock className="text-green-500" />
                    <span>Secured by Stripe — your payment info is never stored on our servers.</span>
                </div>

                {/* Pay button */}
                <button
                    onClick={handlePayment}
                    className="btn bg-secondary hover:bg-secondary/90 text-white font-bold w-full rounded-xl py-3 flex items-center justify-center gap-2"
                >
                    <FaMoneyBillWave />
                    Pay ৳{parcel?.cost} via Stripe
                </button>

                <Link to="/dashboard/my-parcels" className="block text-center text-sm text-gray-400 hover:text-secondary mt-4 transition-colors">
                    ← Back to My Parcels
                </Link>
            </div>
        </div>
    );
};

export default Payment;
