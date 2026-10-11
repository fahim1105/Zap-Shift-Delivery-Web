import React from 'react';
import Banner from '../Banner/Banner';
import Hero from '../Hero/Hero';
import OurServices from '../OurServices/OurServices';
import Brands from '../Brands/Brands';
import WhatWeDo from '../WhatWeDo/WhatWeDo';
import Merchant from '../Merchant/Merchant';
import CustomerSays from '../CustomerSays/CustomerSays';
import FAQ from '../FAQ/FAQ';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Hero></Hero>
            <OurServices></OurServices>
            <Brands></Brands>
            <WhatWeDo></WhatWeDo>
            <Merchant></Merchant>
            <CustomerSays></CustomerSays>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;