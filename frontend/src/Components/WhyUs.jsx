import React from 'react';
import { CheckCircle } from "lucide-react";

function WhyUs() {
  const points = [
    "Save 5+ hours weekly on debugging",
    "Improve exam scores by 40% average",
    "Track learning progress in real-time",
    "Get personalized AI tutoring 24/7",
    "Rich Resources",
  ];

  return (
    <div className="w-full bg-[#0A001F] py-12 sm:py-20" id="WhyUs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#D8B8FF]">Why Us</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#D8B8FF]/80">
            Faster coding help. Smarter exam prep. Real results.
          </p>
        </div>

        {/* Points + Image Horizontal */}
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          {/* Points List */}
          <ul className="space-y-4 sm:space-y-6 flex-1 lg:pr-10">
            {points.map((point, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-base sm:text-lg md:text-xl text-[#D8B8FF] transition-colors hover:text-[#B266FF]"
              >
                <CheckCircle className="text-[#FF6EFF] w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Image */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <img
              src="Photo.jpg"
              alt="Why Us Illustration"
              className="w-full max-w-md sm:max-w-lg lg:max-w-[600px] h-auto rounded-xl shadow-xl border border-[#D8B8FF]/30 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyUs;
