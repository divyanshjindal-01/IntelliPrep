import React from "react";

const Hero = () => {
  return (
    <section className="flex items-center justify-between px-20 py-16 bg-white">
      {/* Left Text */}
      <div className="max-w-[50%]">
        <h1 className="text-5xl font-extrabold leading-tight mb-4">
          AI That Prepares <br /> You For Success
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Code smarter, learn faster, achieve more.
        </p>

        <button className="bg-gray-900 text-white px-7 py-3 rounded-full text-base font-semibold cursor-pointer transition hover:bg-gray-700 mb-8">
          Get Started
        </button>

        {/* Stats */}
        <div className="flex gap-16">
          <div>
            <strong className="block text-xl font-bold">98%</strong>
            <p className="text-sm text-gray-600 mt-1">AI Accuracy</p>
          </div>
          <div>
            <strong className="block text-xl font-bold">24/7</strong>
            <p className="text-sm text-gray-600 mt-1">Support</p>
          </div>
        </div>
      </div>

      {/* Right Image Placeholder */}
      <div className="flex items-center justify-center">
        <div className="h-[300px] w-[300px] border m-2 overflow-hidden bg-gray-900 rounded-full text-white flex items-center justify-center text-center text-base font-semibold">
         <img src="image.jpg" alt="" 
           className="h-full w-full object-cover"/>
        </div>
      </div>
    </section>
  );
};

export default Hero;
