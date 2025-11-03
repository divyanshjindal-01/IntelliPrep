import React from "react";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

function AIfeatures2() {
  return (
    <section id="features" className="py-12 sm:py-16 bg-[#0A001F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#D8B8FF]">
            Powerful AI Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#D8B8FF]/80">
            Everything you need to master coding and ace your exams
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Dashborad.... */}
          <div
            className="relative bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full
hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            {/* Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl text-[#FF6EFF]">📱</span>
            </div>

            {/* Title & Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#D8B8FF]">
                Interactive Dashboard
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80">
                Beautiful, intuitive interface with real-time progress tracking.
              </p>
            </div>

            {/* Status/Icons Row */}
            <div className="flex justify-center gap-3 mb-4 sm:mb-6 mt-auto">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-full flex items-center justify-center text-xs sm:text-sm">
                📈
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs sm:text-sm">
                🕒
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full flex items-center justify-center text-xs sm:text-sm">
                🔔
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs sm:text-sm">
                💡
              </div>
            </div>

            {/* Button */}
            <Link to={"/studentdashboard"} className="mt-auto">
              <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition cursor-pointer">
                Go To Dashboard
              </button>
            </Link>
          </div>

          {/* Smart Weakness Tracker */}
          <div
            className="relative bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full
hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            {/* Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl text-[#FF6EFF]">📊</span>
            </div>

            {/* Title & Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#D8B8FF]">
                Smart Weakness Tracker
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80">
                AI analyzes your performance and identifies areas that need
                improvement.
              </p>
            </div>

            {/* Issues List */}
            <div className="flex flex-col gap-2 mb-4 sm:mb-6 mt-auto text-left">
              {[
                {
                  label: "Syntax Error in line 12",
                  type: "error",
                  color: "text-red-400",
                },
                {
                  label: "Unused variable: 'count'",
                  type: "warning",
                  color: "text-yellow-400",
                },
                {
                  label: "Missing semicolon",
                  type: "error",
                  color: "text-red-400",
                },
              ].map((issue, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-xs sm:text-sm text-[#D8B8FF]/90"
                >
                  <div className="w-2 h-2 rounded-full bg-[#D8B8FF]/60"></div>
                  <span className={`${issue.color}`}>{issue.label}</span>
                </div>
              ))}
            </div>

            {/* Button */}
            <Link to={"/errordashboard"} className="mt-auto">
              <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition cursor-pointer">
                Check Your Errors
              </button>
            </Link>
          </div>

          {/* Gamified Learning */}
          <div
            className="relative bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full
hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            {/* Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl text-[#FF6EFF]">🎮</span>
            </div>

            {/* Title & Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#D8B8FF]">
                Gamified Learning
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80">
                Earn badges, track streaks, and compete with friends to stay
                motivated
              </p>
            </div>

            {/* Badges & Streak */}
            <div className="flex flex-col items-center mt-auto mb-4 sm:mb-6">
              <div className="flex gap-3 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs sm:text-sm">
                  🏆
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full flex items-center justify-center text-xs sm:text-sm">
                  ⭐
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs sm:text-sm">
                  🔥
                </div>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#D8B8FF]">
                7-day streak! 🔥
              </div>
            </div>

            {/* Button */}
            <Link to="/quizdashboard" className="mt-auto">
              <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition cursor-pointer">
                Start Challenge
              </button>
            </Link>
          </div>

          {/* Ai Study coach */}
          <div
            className="relative bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full 
hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            {/* Lock Icon (Fixed Top Right) */}
            <div className="absolute top-3 right-3 bg-[#FF6EFF]/20 border border-[#FF6EFF] rounded-full p-2">
              <FaLock className="text-[#FF6EFF] text-sm sm:text-base" />
            </div>

            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">🎯</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">
                AI Study Coach
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                Personalized study plans and smart reminders to keep you on
                track.
              </p>
            </div>

            <div className="space-y-1 mt-auto text-left text-[#D8B8FF]/90 text-xs sm:text-sm">
              {[
                { label: "Complete React tutorial", color: "bg-green-500" },
                { label: "Practice algorithms (30 min)", color: "bg-pink-500" },
                { label: "Review data structures", color: "bg-gray-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <Link to="pricingpage"></Link>
            <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-auto cursor-pointer">
              Learn With Ai
            </button>
          </div>

          {/* Community Support */}

          <div
            className="relative bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full
  hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            {/* Lock Icon (Fixed Top Right Corner) */}
            <div className="absolute top-3 right-3 bg-[#FF6EFF]/20 border border-[#FF6EFF] rounded-full p-2">
              <FaLock className="text-[#FF6EFF] text-sm sm:text-base" />
            </div>

            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">👥</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">
                Community Support
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                Get help from AI and connect with fellow learners worldwide.
              </p>
            </div>

            <div className="flex justify-center -space-x-2 mt-auto text-xs sm:text-sm">
              {["pink-500", "yellow-500", "red-500", "green-500"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-6 sm:w-8 h-6 sm:h-8 bg-${color} rounded-full border-2 border-[#0A001F]`}
                  ></div>
                )
              )}
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-500 rounded-full border-2 border-[#0A001F] flex items-center justify-center text-xs sm:text-[10px] text-[#0A001F]">
                +5K
              </div>
            </div>
            <Link to="/pricingpage"></Link>
            <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-auto cursor-pointer">
              Join Community
            </button>
          </div>
          {/* Challenge Mode */}
          <div
            className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full 
hover:scale-105 hover:shadow-2xl transition duration-300 relative"
          >
            {/* Icon */}
            <div className="absolute top-3 right-3 bg-[#FF6EFF]/20 border border-[#FF6EFF] rounded-full p-2">
              <FaLock className="text-[#FF6EFF] text-sm sm:text-base" />
            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl text-[#FF6EFF]">🏆</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">
              Challenge Mode
            </h3>
            <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
              Take on coding challenges, earn badges, and compete with friends.
            </p>

            <div className="space-y-2 mt-auto text-left text-[#D8B8FF]/90 text-xs sm:text-sm">
              {[
                { label: "Daily coding challenge", color: "bg-green-500" },
                { label: "Weekly leaderboard", color: "bg-yellow-500" },
                { label: "Earn XP & Badges", color: "bg-pink-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <Link to="/pricingpage">
              <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-4 cursor-pointer">
                Start Challenge
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIfeatures2;
