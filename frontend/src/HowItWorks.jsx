import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    img: "11.jpeg",
    title: "Sign Up",
    description: "Create your free account in seconds",
  },
  {
    img: "12.jpeg",
    title: "Install Extension",
    description: "Add our browser or VS Code extension",
  },
  {
    img: "Dev.jpeg",
    title: "Learn & Debug",
    description: "Start coding with AI assistance",
  },
  {
    img: "14.png",
    title: "Track Progress",
    description: "Monitor your growth and earn rewards",
  },
];

const HowItWorks = () => {
  return (
    <div className="text-center py-16">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4">How It Works</h2>
        <p className="text-xl text-gray-600">
          Get started in just 4 simple steps
        </p>
      </div>

      {/* Steps Section */}
      <div className="relative flex flex-col items-center space-y-24">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`relative flex items-center gap-[185px] ${
              index % 2 === 1 ? "flex-row-reverse" : ""
            }`}
          >
            {/* Circle with Image */}
            <div className="h-[400px] w-auto  overflow-hidden shadow-xl transition-transform duration-300 hover:scale-110 z-10">
              <img
                src={step.img}
                alt={step.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="text-left max-w-sm">
              <h3 className="text-[45px] m-2 font-semibold transition-colors duration-300 hover:text-indigo-600">
                {step.title}
              </h3>
              <p className="text-2xl text-gray-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
