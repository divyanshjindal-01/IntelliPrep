import React from "react";
import { motion } from "framer-motion";

const steps = [
  { img: "11.jpeg", title: "Sign Up", description: "Create your free account in seconds" },
  { img: "12.jpeg", title: "Install Extension", description: "Add our browser or VS Code extension" },
  { img: "Dev.jpeg", title: "Learn & Debug", description: "Start coding with AI assistance" },
  { img: "14.png", title: "Track Progress", description: "Monitor your growth and earn rewards" },
];

const HowItWorks = () => {
  return (
    <div id="HowItWorks" className="py-20 sm:py-24 bg-[#0A001F] px-4 sm:px-6 lg:px-20">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#63B0FF]">How It Works</h2>
        <p className="text-base sm:text-lg md:text-xl text-[#63B0FF]/80">
          Get started in just 4 simple steps
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col space-y-20">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col items-center gap-8 lg:flex-row lg:items-center ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="flex justify-center lg:flex-1">
              <img
                src={step.img}
                alt={step.title}
                className="w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[450px] h-auto object-contain rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Text */}
            <div className="lg:flex-1 text-center lg:text-left mt-6 lg:mt-0">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-[#63B0FF] transition-colors duration-300 hover:text-[#7CC3FF]">
                {step.title}
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-[#63B0FF]/80">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
