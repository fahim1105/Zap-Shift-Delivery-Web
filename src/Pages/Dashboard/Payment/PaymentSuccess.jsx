import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const [copiedField, setCopiedField] = useState(null);
    const axiosSecure = UseAxiosSecure();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`, { session_id: sessionId })
                .then(res => {
                    setPaymentInfo({
                        tracking_id: res.data.trackingId,
                        transaction_id: res.data.transactionId
                    });
                })
                .catch(err => console.log(err));
        }
    }, [sessionId, axiosSecure]);

    const handleCopy = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral/50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-center">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-4xl text-green-500" />
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-secondary mb-2">Payment Successful!</h1>
                <p className="text-gray-500 text-sm mb-8">Your parcel is confirmed and being processed. Keep your tracking ID handy.</p>

                {/* Details */}
                <div className="bg-neutral rounded-2xl p-5 mb-8 text-left space-y-4">
                    {/* Tracking ID */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking ID</p>
                        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200">
                            <span className="text-secondary font-mono font-bold text-sm break-all">
                                {paymentInfo.tracking_id || '—'}
                            </span>
                            <button
                                onClick={() => handleCopy(paymentInfo.tracking_id, 'track')}
                                className="ml-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-secondary"
                                title="Copy Tracking ID"
                            >
                                {copiedField === 'track' ? <FiCheck className="text-green-500" /> : <FiCopy />}
                            </button>
                        </div>
                    </div>

                    {/* Transaction ID */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
                        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200">
                            <span className="text-gray-600 text-xs font-mono break-all leading-tight">
                                {paymentInfo.transaction_id || 'Processing...'}
                            </span>
                            <button
                                onClick={() => handleCopy(paymentInfo.transaction_id, 'trans')}
                                className="ml-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-secondary"
                                title="Copy Transaction ID"
                            >
                                {copiedField === 'trans' ? <FiCheck className="text-green-500" /> : <FiCopy />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/dashboard/my-parcels"
                        className="btn bg-secondary hover:bg-secondary/90 text-white font-bold w-full rounded-xl"
                    >
                        View My Parcels
                    </Link>
                    <Link
                        to="/"
                        className="text-gray-400 hover:text-secondary text-sm transition-colors py-2"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
