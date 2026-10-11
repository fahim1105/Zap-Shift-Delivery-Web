import React from 'react';
import BannerIMG from '../../assets/location-merchant.png';
import TopIMG from '../../assets/be-a-merchant-bg.png';
import { Link } from 'react-router';

const Merchant = () => {
    return (
        <div
            style={{ backgroundImage: `url(${TopIMG})` }}
            className="flex flex-col md:flex-row justify-between items-center bg-secondary p-10 md:p-20 rounded-3xl bg-no-repeat my-20"
        >
            {/* Text */}
            <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                <h1 className="font-extrabold text-white text-3xl md:text-4xl mb-5">
                    Merchant and Customer Satisfaction is Our First Priority
                </h1>
                <p className="text-white text-sm md:text-base mb-6">
                    We offer the lowest delivery charge with the highest value along with 100% safety of your product. ZapShift delivers your parcels in every corner of Bangladesh right on time.
                </p>
                <div className="flex flex-col md:flex-row gap-4 md:gap-5 justify-center md:justify-start">
                    <Link to="/send-parcel" className="py-4 px-8 rounded-3xl bg-primary font-bold text-center">
                        Become a Merchant
                    </Link>
                    <Link to="/be-a-rider" className="text-primary rounded-3xl py-4 px-8 border border-primary font-bold text-center">
                        Earn with ZapShift Courier
                    </Link>
                </div>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <img src={BannerIMG} alt="Merchant Banner" className="w-full max-w-md" />
            </div>
        </div>
    );
};

export default Merchant;
