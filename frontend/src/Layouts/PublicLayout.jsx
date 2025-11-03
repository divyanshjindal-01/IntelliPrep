// src/layouts/PublicLayout.jsx
import React from 'react';
import Navbar from '../Components/Navbar'
import Hero from '../components/Hero';
import AIfeatures from '../components/AIfeatures';
import HowItworks from '../Components/HowItWorks'
import WhyUs from '../components/WhyUs';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <>
      <Navbar/>
      <Hero />
      <AIfeatures />
      <HowItworks/>
      <WhyUs />
      <Footer />
    </>
  );
};

export default PublicLayout;
