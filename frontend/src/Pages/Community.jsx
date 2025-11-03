import React from "react";

const Community = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A001F] text-[#D8B8FF] px-4 sm:px-6 lg:px-20 py-16">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          JOIN OUR COMMUNITY
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#D8B8FF]/80 mt-4 max-w-xl sm:max-w-2xl">
          "Connect with peers, share your debugging journey, and turn coding
          challenges into collaborative learning opportunities."
        </p>
        <button className="mt-6 bg-gradient-to-r from-[#63B0FF] to-[#7CC3FF] text-white px-6 py-2 rounded-full cursor-pointer hover:opacity-90 transition w-full sm:w-auto">
          GET STARTED
        </button>
      </div>

      {/* Image Section */}
      <div className="mt-12 flex justify-center">
        <img
          src="Community.png"
          alt="community"
          className="w-full max-w-full sm:max-w-4xl md:max-w-5xl rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default Community;
