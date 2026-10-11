import React from 'react';
import CustomerSaysIMG from '../../assets/customer-top.png'
import Reviews from './Reviews';

const reviewPromise = fetch("/reviews.json")
.then(res => res.json())

const CustomerSays = () => {
    return (
        <div>
            <div className='flex justify-center'>
                <img src={CustomerSaysIMG} alt="" />
            </div>
            <div className='text-center'>
                <h1 className='text-3xl font-bold text-secondary mt-10 mb-5'>What our customers are sayings</h1>
                <p className='text-lg mb-10 lg:w-5xl mx-auto'>Don't just take our word for it — hear directly from thousands of happy customers who trust ZapShift for their everyday deliveries.</p>
            </div>
            <div className='my-20'>
                <Reviews reviewPromise={reviewPromise}></Reviews>
            </div>
        </div>
    );
};

export default CustomerSays;