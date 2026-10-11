import React from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = React.useState(null);

    const faqsData = [
        {
            question: 'How long does delivery take?',
            answer: 'Most orders arrive within 30–45 minutes depending on your location and restaurant distance.'
        },
        {
            question: 'Can I track my order in real-time?',
            answer: 'Yes! You can track your delivery partner live from pickup to drop-off.'
        },
        {
            question: 'What payment methods are supported?',
            answer: 'We support Cash on Delivery, Credit/Debit Cards, and Mobile Banking (bKash, Nagad, Rocket).'
        },
        {
            question: 'How do I get a refund for a wrong or missing item?',
            answer: 'Go to Support → Order Help → Report Issue. Our team will process your refund within 24 hours.'
        },
        {
            question: 'Do you offer scheduled delivery?',
            answer: 'Yes, you can schedule deliveries up to 24 hours in advance during checkout.'
        }
    ];

    return (
        <div className='flex flex-col items-center text-center text-slate-800 px-3 py-10'>
            <h1 className='text-3xl text-secondary md:text-4xl font-semibold mt-2'>Frequently Asked Question (FAQ)</h1>
            <p className='text-sm text-secondary mt-4 max-w-lg'>
                Got questions about our delivery service? We've answered the most common ones below to help you ship with confidence.
            </p>

            <div className='max-w-xl w-full mt-6 flex flex-col gap-4 items-start text-left'>
                {faqsData.map((faq, index) => (
                    <div key={index} className='flex flex-col items-start w-full'>
                        <div
                            className='flex items-center justify-between w-full cursor-pointer border border-indigo-100 p-4 rounded'
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <h2 className='text-sm font-medium'>{faq.question}</h2>

                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}
                            >
                                <path
                                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                                    stroke="#1D293D"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <p className={`text-sm text-slate-500 px-4 transition-all duration-500 ease-in-out ${openIndex === index
                            ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                            : "opacity-0 max-h-0 -translate-y-2"
                            }`}>
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
