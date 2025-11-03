// src/Pages/Home.jsx
import React from "react";
import { useAuth } from "../AuthContext";
import Hero from "../Components/Hero";
import Hero2 from "../Components/Hero2";
import AIfeatures from "../Components/AIfeatures";
import AIfeatures2 from "../Components/AIfeatures2";
import HowItWorks from "../Components/HowItWorks";
import WhyUs from "../Components/WhyUs";

const Home = ({ onLoginClick }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <>
        <Hero onLoginClick={onLoginClick} />
        <AIfeatures />
        <HowItWorks />
        <WhyUs />
      </>
    );
  } else {
    return (
      <>
        <Hero2 />
        <AIfeatures2 />
      </>
    );
  }
};

export default Home;
