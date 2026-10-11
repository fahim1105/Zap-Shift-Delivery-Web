import React from 'react';
import { Link } from 'react-router';
import { ShieldOff } from 'lucide-react';

const Forbidden = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-4 text-center">
            {/* Icon */}
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
                <ShieldOff className="w-12 h-12 text-red-500" />
            </div>

            {/* Status Code */}
            <h1 className="text-7xl font-extrabold text-secondary mb-2">403</h1>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
                Access Denied
            </h2>

            {/* Description */}
            <p className="text-gray-500 max-w-md mb-8 text-sm md:text-base">
                You don't have permission to view this page. This area is restricted to authorized roles only.
                Please go back or return to the homepage.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    to="/"
                    className="btn btn-primary text-accent px-8"
                >
                    Go to Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="btn btn-outline px-8"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Forbidden;
