import React from 'react';
import LogoIMG from '../assets/Group 3.png'
import { Link, Outlet } from 'react-router';
import AuthIMG from '../assets/authImage.png'

const AuthLayout = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <Link to="/">
                <img src={LogoIMG} alt="" />
            </Link>
            <div className='flex items-center'>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
                <div className='flex-1'>
                    <img src={AuthIMG} alt="" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;