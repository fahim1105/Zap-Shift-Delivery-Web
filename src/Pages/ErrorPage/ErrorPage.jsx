import React from 'react';
import './ErrorPage.css'
import { useNavigate } from 'react-router';
import { CornerLeftUp } from 'lucide-react';

const ErrorPage = () => {
    const navigate = useNavigate()
    return (
        <div className="h-screen flex justify-center items-center bg-white/50">
            <section className="page_404">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">

                            <div className="col-sm-10 col-sm-offset-1 text-center">

                                <div className="four_zero_four_bg">
                                    <h1 className="text-center">Page Not Found</h1>
                                </div>

                                <div
                                    onClick={() => navigate("/")}
                                    className="contant_box_404 ">
                                    <p className='mx-auto bg-secondary/90 text-white hover:bg-secondary py-3 px-5 text-center text-2xl border-2 border-neutral hover:border-accent rounded-xl w-60 flex justify-center items-center gap-5'>
                                        <CornerLeftUp /> Go to Home
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ErrorPage;
