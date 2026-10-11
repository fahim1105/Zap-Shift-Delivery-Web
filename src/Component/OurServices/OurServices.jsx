import cardIMG from "../../assets/service.png";

const data = [
    {
        title: "Express & Standard Delivery",
        desc: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    },
    {
        title: "Nationwide Delivery",
        desc: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    },
    {
        title: "Fulfillment Solution",
        desc: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    },
    {
        title: "Cash on Home Delivery",
        desc: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    },
    {
        title: "Corporate Service / Contract In Logistics",
        desc: "Customized corporate services which include warehouse and inventory management support.",
    },
    {
        title: "Parcel Return",
        desc: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    },
];

export default function OurServices() {
    return (
        <section className="w-full bg-[#03373D] py-14 md:py-20 rounded-3xl mt-10">
            
            {/* Heading */}
            <div className="text-center text-white mb-12 w-11/12 mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold">Our Services</h2>
                <p className="text-gray-200 mt-2 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                    Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                    From personal packages to business shipments — we deliver on time, every time.
                </p>
            </div>

            {/* Grid */}
            <div className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {data.map((item, i) => (
                    <div
                        key={i}
                        className="
                            group rounded-2xl px-6 py-8 md:p-10 
                            shadow-sm border bg-white 
                            transition-all duration-300 
                            hover:bg-[#CAEB66] hover:text-[#0B0B0B]
                        "
                    >
                        {/* Circle with Image */}
                        <div className="flex justify-center mb-5">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <img
                                    src={cardIMG}
                                    alt="service"
                                    className="w-10 h-10 md:w-12 md:h-12 object-contain transition-all duration-300 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h3
                            className="text-lg md:text-xl font-semibold text-center mb-3 text-[#0B0B0B] group-hover:text-[#0B0B0B]"
                        >
                            {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-center text-gray-700 text-sm md:text-base group-hover:text-[#0B0B0B]">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
