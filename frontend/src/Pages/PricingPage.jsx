// src/components/PricingPage.jsx
import React from "react";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const PricingPage = () => {
  const plans = [
    {
      title: "AI Study Coach",
      description: "Personalized study plans and smart reminders to keep you on track.",
      features: [
        { label: "Complete React tutorial", color: "bg-green-500" },
        { label: "Practice algorithms (30 min)", color: "bg-pink-500" },
        { label: "Review data structures", color: "bg-gray-500" },
      ],
      icon: "🎯",
      price: "$9.99/mo",
      locked: true,
    },
    {
      title: "Community Support",
      description: "Get help from AI and connect with fellow learners worldwide.",
      features: [
        { label: "Access AI help", color: "bg-green-500" },
        { label: "Connect with learners", color: "bg-pink-500" },
        { label: "Weekly Q&A sessions", color: "bg-gray-500" },
      ],
      icon: "👥",
      price: "$4.99/mo",
      locked: true,
    },
    {
      title: "Challenge Mode",
      description: "Take on coding challenges, earn badges, and compete with friends.",
      features: [
        { label: "Daily coding challenge", color: "bg-green-500" },
        { label: "Weekly leaderboard", color: "bg-yellow-500" },
        { label: "Earn XP & Badges", color: "bg-pink-500" },
      ],
      icon: "🏆",
      price: "$14.99/mo",
      locked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A001F] py-12 px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#D8B8FF] mb-8">
        Upgrade Your Learning
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className="relative bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full 
            hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            {/* Lock Icon */}
            {plan.locked && (
              <div className="absolute top-3 right-3 bg-[#FF6EFF]/20 border border-[#FF6EFF] rounded-full p-2">
                <FaLock className="text-[#FF6EFF] text-sm sm:text-base" />
              </div>
            )}

            {/* Icon & Title */}
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">{plan.icon}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">
                {plan.title}
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                {plan.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-1 mt-auto text-left text-[#D8B8FF]/90 text-xs sm:text-sm">
              {plan.features.map((item) => (
                <div key={item.label} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="mt-6">
              <span className="block text-[#FF6EFF] font-bold text-lg mb-2">
                {plan.price}
              </span>
              <Link to="/pricing">
                <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-auto cursor-pointer">
                  {plan.locked ? "Upgrade Now" : "Start Learning"}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
