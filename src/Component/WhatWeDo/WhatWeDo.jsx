import React from "react";

const serviceData = [
    {
        title: "Live Parcel Tracking",
        desc: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
        img: "https://i.ibb.co.com/sdKmh9bM/live-tracking.png",
    },
    {
        title: "100% Safe Delivery",
        desc: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
        img: "https://i.ibb.co.com/7JhQP99V/safe-delivery.png",
    },
    {
        title: "24/7 Call Center Support",
        desc: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
        img: "https://cdn-icons-png.flaticon.com/512/597/597177.png",
    },
];

const WhatWeDo = () => {
    return (
        <div className="w-11/12 mx-auto my-16 space-y-8">
            {serviceData.map((item, index) => (
                <div
                    key={index}
                    className="bg-neutral shadow-sm rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-all duration-300"
                >
                    {/* Icon / Image */}
                    <img
                        src={item.img}
                        alt={item.title}
                        className="w-32 h-32 object-contain"
                    />

                    {/* Divider */}
                    <div className="h-24 w-px bg-gray-300 hidden sm:block"></div>

                    {/* Text Content */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">
                            {item.title}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WhatWeDo;
