import React from "react";
import { useNavigate } from "react-router-dom";

const Hero2 = () => {
  const navigate = useNavigate();

  const handleCheckErrors = () => {
    navigate("/errordashboard"); // yahan route daal do jo tumhare ErrorDashboard ka hai
  };

  return (
    <section
      id="Hero"
      className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-20 py-16 min-h-screen bg-[#0A001F]"
    >
      {/* Left Text */}
      <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-[#D8B8FF]">
          AI That Prepares <br /> You For Success
        </h1>
        <p className="text-base md:text-lg text-[#D8B8FF]/80 mb-6">
          Code smarter, learn faster, achieve more.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleCheckErrors}
            className="bg-[#FF6EFF] hover:bg-[#E07BFF] text-[#0A001F] px-8 py-3 rounded-full text-lg font-semibold cursor-pointer transition-shadow shadow-lg hover:shadow-xl"
          >
            Check Errors
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 mt-10">
          <div>
            <strong className="block text-2xl sm:text-xl font-bold text-[#D8B8FF]">98%</strong>
            <p className="text-sm text-[#D8B8FF]/70 mt-1">AI Accuracy</p>
          </div>
          <div>
            <strong className="block text-2xl sm:text-xl font-bold text-[#D8B8FF]">24/7</strong>
            <p className="text-sm text-[#D8B8FF]/70 mt-1">Support</p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div className="h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80 border-4 border-[#FF6EFF] overflow-hidden bg-[#0A001F] rounded-full shadow-lg">
          <img
            src="image.jpg"
            alt="Student learning with laptop"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero2;
