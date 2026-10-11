import React from 'react';
import { FaQuoteLeft, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} className="text-yellow-400 w-3.5 h-3.5" />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 w-3.5 h-3.5" />);
        } else {
            stars.push(<FaRegStar key={i} className="text-yellow-400 w-3.5 h-3.5" />);
        }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ReviewCard = ({ review }) => {
    const { userName, review: testimonial, user_photoURL, ratings } = review;

    return (
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-5 sm:p-6 bg-white rounded-2xl shadow-md border border-gray-100">

            {/* Quote Icon */}
            <FaQuoteLeft className="text-secondary w-6 h-6 sm:w-7 sm:h-7 mb-3 sm:mb-4" />

            {/* Review Text */}
            <p className="text-xs sm:text-sm md:text-base text-secondary leading-relaxed mb-5 sm:mb-6">
                {testimonial}
            </p>

            {/* Divider */}
            <hr className="border-dashed border-t border-secondary mb-5 sm:mb-6" />

            {/* User Info */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-secondary/20">
                        <img
                            src={user_photoURL}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div>
                    <div className="text-sm sm:text-base font-semibold text-secondary">
                        {userName}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={ratings} />
                        <span className="text-xs text-secondary/60">({ratings})</span>
                    </div>
                    <div className="text-xs sm:text-sm text-secondary/60 mt-0.5">
                        Verified Customer
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
