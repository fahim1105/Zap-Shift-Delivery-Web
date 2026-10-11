import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Component/Footer/Footer';
import Navbar from '../Component/Navbar/Navbar';

const RootLayout = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <section>
                <Navbar></Navbar>
            </section>
            <main>
                <Outlet></Outlet>
            </main>
            <section>
                <Footer></Footer>
            </section>
        </div>
    );
};

export default RootLayout;