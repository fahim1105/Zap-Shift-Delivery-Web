import React from 'react';
import { Link } from 'react-router';
import { FaTimesCircle } from 'react-icons/fa';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const PaymentCancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral/50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-center">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <FaTimesCircle className="text-4xl text-red-500" />
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-secondary mb-2">Payment Cancelled</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Your transaction was interrupted. No charges were made to your account. You can retry anytime.
                </p>

                {/* Common Issues */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 mb-8 text-left">
                    <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-widest mb-3">Common Reasons</h4>
                    <ul className="text-sm text-yellow-800 space-y-1.5">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></span>
                            Bank verification timeout
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></span>
                            Insufficient balance
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></span>
                            Window closed accidentally
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/dashboard/my-parcels"
                        className="btn bg-secondary hover:bg-secondary/90 text-white font-bold w-full rounded-xl flex items-center justify-center gap-2"
                    >
                        <FiRefreshCw />
                        Try Payment Again
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 text-gray-400 hover:text-secondary text-sm transition-colors py-2"
                    >
                        <FiArrowLeft />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;
