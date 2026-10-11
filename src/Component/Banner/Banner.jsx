import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
    return (
        <div className="rounded-3xl overflow-hidden">
            <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                showArrows={false}
                stopOnHover={false}
                interval={3000}
            >

                {/* Slide Template */}
                {[
                    "https://i.ibb.co.com/Cpc9FM26/banner1.png",
                    "https://i.ibb.co.com/HD78HrVm/banner2.png",
                    "https://i.ibb.co.com/SD9X67xh/banner3.png"
                ].map((src, index) => (
                    <div key={index} className="relative">
                        {/* Banner Image */}
                        <img
                            src={src}
                            className="w-full object-cover rounded-3xl"
                        />

                        {/* Overlay buttons (SAME POSITION FOR EVERY SLIDE) */}
                        {/* <div
                            className="
                                absolute 
                                bottom-6 left-6
                                md:bottom-20 md:left-20
                                flex flex-wrap items-center 
                                gap-3 
                                z-10
                            "
                        >
                            <button className="bg-primary px-5 py-2 rounded-full font-medium hover:bg-primary/80 text-sm md:text-base">
                                Track Your Parcel
                            </button>

                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                                <ArrowUpRight className="text-primary w-5 h-5" />
                            </div>

                            <button className="border border-gray-300 px-6 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-100 text-sm md:text-base">
                                Sign In
                            </button>
                        </div> */}
                    </div>
                ))}

            </Carousel>
        </div>
    );
};

export default Banner;
