import React, { useState } from "react";
import { motion } from "framer-motion";

const tabs = [
    {
        key: "story",
        label: "Our Story",
        content:
            "Our journey began with a simple but ambitious promise: to make parcel delivery fast, reliable, and stress-free across Bangladesh. From humble beginnings as a small startup, we grew into a nationwide logistics network trusted by thousands of customers daily. Every parcel we handle — whether it's a personal gift, urgent documents, or critical business shipments — is treated with care, precision, and accountability. Over the years, we invested heavily in technology, including real-time tracking, smart routing algorithms, and data-driven logistics, to ensure transparency and efficiency at every step of the delivery process.",
    },
    {
        key: "mission",
        label: "Our Mission",
        content:
            "Our mission is to revolutionize the way people think about delivery services. We aim to provide seamless, fast, and secure parcel delivery to every corner of the country. At the heart of our mission is a commitment to transparency, reliability, and customer satisfaction. We leverage cutting-edge technology — advanced routing systems, real-time tracking, automated notifications, and AI-powered logistics — to streamline operations and reduce delivery times. By combining innovation with care, we ensure that every delivery enhances trust between us and our customers.",
    },
    {
        key: "success",
        label: "Our Success",
        content:
            "Our success is a direct reflection of our unwavering commitment to excellence, efficiency, and customer-centric service. We have successfully delivered hundreds of thousands of parcels across Bangladesh — from major cities to remote areas — building a reputation for reliability and punctuality. Thousands of satisfied customers, glowing reviews, and repeat clients demonstrate the impact of our efforts. We also measure success by how well we empower our employees, maintain sustainable practices, and contribute positively to our communities.",
    },
    {
        key: "team",
        label: "Team & Others",
        content:
            "Behind every successful delivery is a dedicated team of professionals who embody precision, efficiency, and care. Our logistics experts meticulously plan routes to optimize time and fuel. Our delivery personnel are trained to handle parcels with the utmost care, maintaining professionalism during every interaction. The customer support team is available 24/7 to assist and resolve queries. Every member contributes to a larger mission: delivering not just parcels, but trust, satisfaction, and peace of mind.",
    },
];

const stats = [
    { value: "64+", label: "Districts Covered" },
    { value: "500K+", label: "Parcels Delivered" },
    { value: "10K+", label: "Happy Merchants" },
    { value: "99.2%", label: "On-Time Rate" },
];

const AboutUs = () => {
    const [active, setActive] = useState("story");

    return (
        <div className="w-11/12 mx-auto py-14 md:py-20">

            {/* Hero */}
            <div className="text-center mb-14">
                <span className="inline-block bg-primary text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    About ZapShift
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
                    Delivering Trust, Not Just Parcels
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                    Fast, reliable parcel delivery with real-time tracking and zero hassle — from personal packages to business shipments, we deliver on time, every time.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-secondary rounded-2xl p-6 text-center">
                        <p className="text-3xl font-extrabold text-primary mb-1">{stat.value}</p>
                        <p className="text-gray-300 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Tab Section */}
            <div className="bg-neutral rounded-3xl p-8 md:p-12">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 md:gap-6 mb-8 border-b border-gray-300 pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActive(tab.key)}
                            className={`pb-1 text-sm md:text-base font-semibold transition-all duration-300 ${
                                active === tab.key
                                    ? "text-secondary border-b-2 border-secondary"
                                    : "text-gray-400 hover:text-secondary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-700 leading-relaxed text-base md:text-lg"
                >
                    {tabs.find((t) => t.key === active)?.content}
                </motion.p>
            </div>

            {/* Values */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { emoji: "⚡", title: "Speed", desc: "Express same-day delivery in Dhaka, 48-hour nationwide coverage." },
                    { emoji: "🔒", title: "Security", desc: "Every parcel insured and handled with full accountability end-to-end." },
                    { emoji: "📍", title: "Transparency", desc: "Real-time tracking and instant notifications at every delivery step." },
                ].map((v, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                        <span className="text-4xl mb-3 block">{v.emoji}</span>
                        <h3 className="text-lg font-bold text-secondary mb-2">{v.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
