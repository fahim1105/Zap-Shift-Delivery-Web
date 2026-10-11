import { FaTruck, FaMoneyBillWave, FaWarehouse, FaBuilding } from "react-icons/fa";

const steps = [
    {
        icon: <FaTruck />,
        title: "Booking Pick & Drop",
        desc: "Schedule a pickup from your doorstep and we'll deliver it right to the recipient — fast, safe, and hassle-free.",
    },
    {
        icon: <FaMoneyBillWave />,
        title: "Cash On Delivery",
        desc: "We collect payment from your customer on delivery and transfer it directly to you — no upfront collection needed.",
    },
    {
        icon: <FaWarehouse />,
        title: "Delivery Hub",
        desc: "Our strategically located hubs across Bangladesh ensure your parcel reaches even the most remote areas on time.",
    },
    {
        icon: <FaBuilding />,
        title: "Booking SME & Corporate",
        desc: "Tailored bulk delivery solutions for small businesses and large enterprises — scalable, reliable, and cost-effective.",
    },
];

export default function Hero() {
    return (
        <div className="w-11/12 mx-auto py-14 md:py-20">

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#03373D] mb-6 md:mb-10 text-center lg:text-left">
                How it Works
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">

                {steps.map((item, i) => (
                    <div
                        key={i}
                        className="
                            bg-white 
                            rounded-xl 
                            shadow-sm 
                            p-6 md:p-8 
                            border 
                            border-gray-200 
                            hover:shadow-lg 
                            transition-all 
                            duration-300
                        "
                    >
                        <div className="text-[#03373D] text-3xl md:text-4xl mb-4">
                            {item.icon}
                        </div>

                        <h3 className="text-lg md:text-xl font-semibold text-[#03373D] mb-2">
                            {item.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
