import React, { use } from 'react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import ReviewCard from './ReviewCard';

const Reviews = ({ reviewPromise }) => {
    const reviews = use(reviewPromise)
    return (
        <div>
            <>
                <Swiper
                    loop={true}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={3}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    autoplay={
                        {
                            delay: 2000,
                            disableOnInteraction: false,
                        }
                    }
                    // pagination={true}
                    modules={[EffectCoverflow, Autoplay]}
                    className="mySwiper"
                >
                    {
                        reviews.map(review =>
                            <SwiperSlide key={review.id} >
                                <ReviewCard review={review}></ReviewCard>
                            </SwiperSlide>)
                    }
                </Swiper>
            </>
        </div>
    );
};

export default Reviews;