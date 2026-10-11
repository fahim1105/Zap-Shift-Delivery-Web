import React from 'react';
import { Link } from 'react-router';
import { FaTruck, FaMapMarkedAlt, FaBoxOpen, FaMoneyBillWave, FaBuilding, FaUndoAlt } from 'react-icons/fa';
import { MdOutlineTrackChanges } from 'react-icons/md';

const services = [
    {
        icon: <FaTruck className="w-8 h-8" />,
        title: "Express & Standard Delivery",
        desc: "Parcels delivered within 24–72 hours across major cities. Express delivery available in Dhaka within 4–6 hours from pickup to drop-off.",
        badge: "Most Popular",
    },
    {
        icon: <FaMapMarkedAlt className="w-8 h-8" />,
        title: "Nationwide Delivery",
        desc: "Home delivery in every district across Bangladesh. Your parcels reach customers anywhere within 48–72 hours — reliably and safely.",
        badge: null,
    },
    {
        icon: <FaBoxOpen className="w-8 h-8" />,
        title: "Fulfillment Solution",
        desc: "End-to-end fulfillment including inventory management, order processing, packaging, and after-sales support for e-commerce businesses.",
        badge: null,
    },
    {
        icon: <FaMoneyBillWave className="w-8 h-8" />,
        title: "Cash on Delivery",
        desc: "100% cash on delivery anywhere in Bangladesh. We collect from your customers and transfer directly to you — guaranteed product safety.",
        badge: null,
    },
    {
        icon: <FaBuilding className="w-8 h-8" />,
        title: "Corporate & Contract Logistics",
        desc: "Customized corporate delivery solutions with warehouse management, bulk shipment handling, and dedicated account support.",
        badge: "Enterprise",
    },
    {
        icon: <FaUndoAlt className="w-8 h-8" />,
        title: "Parcel Return",
        desc: "Seamless reverse logistics — allow your customers to return or exchange products easily. We handle the pickup and return to your doorstep.",
        badge: null,
    },
];

const pricingPlans = [
    {
        name: "Basic",
        price: "৳60",
        unit: "per parcel",
        features: [
            "Standard delivery (48–72 hrs)",
            "SMS notification",
            "Basic tracking",
            "Up to 5 kg",
        ],
        cta: "Get Started",
        highlight: false,
    },
    {
        name: "Business",
        price: "৳45",
        unit: "per parcel",
        features: [
            "Priority delivery (24–48 hrs)",
            "Real-time tracking",
            "Cash on delivery",
            "Up to 10 kg",
            "Dedicated support",
        ],
        cta: "Start Shipping",
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        unit: "contact us",
        features: [
            "Express same-day delivery",
            "Fulfillment & warehousing",
            "API integration",
            "Unlimited weight",
            "Account manager",
        ],
        cta: "Contact Us",
        highlight: false,
    },
];

const Services = () => {
    return (
        <div className="w-11/12 mx-auto py-14 md:py-20">

            {/* Hero Section */}
            <div className="text-center mb-14">
                <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
                    Our Delivery Services
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                    From single parcel pickups to enterprise-level logistics — ZapShift has a solution for every delivery need across Bangladesh.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                    <Link to="/send-parcel" className="btn btn-primary text-accent px-8">
                        Send a Parcel
                    </Link>
                    <Link to="/coverage" className="btn btn-outline px-8">
                        View Coverage
                    </Link>
                </div>
            </div>

            {/* Services Grid */}
            <section className="mb-20">
                <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-10">
                    What We Offer
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:shadow-lg hover:border-primary transition-all duration-300 group"
                        >
                            {service.badge && (
                                <span className="absolute top-4 right-4 bg-primary text-accent text-xs font-semibold px-3 py-1 rounded-full">
                                    {service.badge}
                                </span>
                            )}
                            <div className="text-secondary mb-4 group-hover:text-primary transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-secondary mb-2">{service.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section className="bg-secondary rounded-3xl p-8 md:p-14 mb-20 text-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    {[
                        { step: "01", title: "Book Online", desc: "Fill out the parcel details and schedule your pickup in under 2 minutes." },
                        { step: "02", title: "We Pick Up", desc: "Our rider arrives at your doorstep at your scheduled time." },
                        { step: "03", title: "We Deliver", desc: "Your parcel is transported safely to the recipient's address." },
                        { step: "04", title: "Confirm & Pay", desc: "Recipient confirms delivery. Cash collected and transferred to you." },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-primary text-accent rounded-full flex items-center justify-center text-xl font-extrabold mb-4">
                                {item.step}
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                            <p className="text-gray-300 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="mb-20">
                <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-4">
                    Simple Pricing
                </h2>
                <p className="text-center text-gray-500 mb-10 text-sm md:text-base">
                    Transparent rates, no hidden fees. Pick a plan that matches your volume.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pricingPlans.map((plan, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl border p-8 flex flex-col ${
                                plan.highlight
                                    ? 'bg-secondary text-white border-secondary shadow-xl scale-105'
                                    : 'bg-white border-gray-200'
                            }`}
                        >
                            <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-primary' : 'text-secondary'}`}>
                                {plan.name}
                            </h3>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                <span className={`text-sm ml-1 ${plan.highlight ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {plan.unit}
                                </span>
                            </div>
                            <ul className="space-y-2 mb-8 flex-1">
                                {plan.features.map((f, j) => (
                                    <li key={j} className={`text-sm flex items-center gap-2 ${plan.highlight ? 'text-gray-200' : 'text-gray-600'}`}>
                                        <span className="text-green-400 font-bold">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/send-parcel"
                                className={`btn w-full ${plan.highlight ? 'btn-primary text-accent' : 'btn-outline'}`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="text-center bg-primary rounded-3xl py-12 px-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-secondary mb-3">
                    Ready to ship your first parcel?
                </h2>
                <p className="text-secondary/70 mb-6 text-sm md:text-base">
                    Join thousands of merchants and individuals who trust ZapShift every day.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link to="/send-parcel" className="btn bg-secondary text-white hover:bg-secondary/90 px-8">
                        Send a Parcel
                    </Link>
                    <Link to="/be-a-rider" className="btn btn-outline border-secondary text-secondary hover:bg-secondary hover:text-white px-8">
                        Become a Rider
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Services;
