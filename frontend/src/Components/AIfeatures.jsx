import React from 'react';

function AIfeatures() {
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
          {/* Real-time Code Detection */}
          <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col h-full">
            <div className="flex-grow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">🔍</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">
                Real-time Code Detection
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                Real-time error detection with intelligent suggestions. Debug faster than ever before.
              </p>
            </div>
            <div className="bg-[#0A001F] rounded-lg p-3 sm:p-4 text-[#D8B8FF] font-mono text-xs sm:text-sm mt-auto border border-[#D8B8FF]/30 text-left">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>function debug() </div>
              <div className="text-pink-400 text-xs sm:text-sm">  console.log("Error found!");</div>
              <div className="text-purple-400 text-xs sm:text-sm">  // AI suggests fix ✨</div>
            </div>
          </div>

          {/* Smart Weakness Tracker */}
          <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">📊</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">
                Smart Weakness Tracker
              </h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                AI analyzes your performance and identifies areas that need improvement.
              </p>
            </div>
            <div className="space-y-2 mt-auto">
              {[
                { label: "JavaScript", width: "w-20", color: "bg-green-500" },
                { label: "Python", width: "w-12", color: "bg-yellow-500" },
                { label: "React", width: "w-8", color: "bg-red-500" },
              ].map((skill) => (
                <div key={skill.label} className="flex items-center justify-between text-[#D8B8FF]/90 text-xs sm:text-sm">
                  <span>{skill.label}</span>
                  <div className="w-24 h-2 bg-[#0A001F] rounded-full border border-[#D8B8FF]/30">
                    <div className={`${skill.width} h-2 ${skill.color} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Study Coach */}
          <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">🎯</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">AI Study Coach</h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                Personalized study plans and smart reminders to keep you on track.
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
          </div>

          {/* Gamified Learning */}
          <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">🎮</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">Gamified Learning</h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                Earn badges, track streaks, and compete with friends to stay motivated
              </p>
            </div>
            <div className="mt-auto">
              <div className="flex justify-center space-x-2 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs sm:text-sm">🏆</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full flex items-center justify-center text-xs sm:text-sm">⭐</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs sm:text-sm">🔥</div>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#D8B8FF]">7-day streak! 🔥</div>
            </div>
          </div>

          {/* Community Support */}
          <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">👥</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">Community Support</h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                Get help from AI and connect with fellow learners worldwide.
              </p>
            </div>
            <div className="flex justify-center -space-x-2 mt-auto text-xs sm:text-sm">
              {["pink-500","purple-500","cyan-500","green-500"].map((color,i)=>(
                <div key={i} className={`w-6 sm:w-8 h-6 sm:h-8 bg-${color} rounded-full border-2 border-[#0A001F]`}></div>
              ))}
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-500 rounded-full border-2 border-[#0A001F] flex items-center justify-center text-xs sm:text-[10px] text-[#0A001F]">+5K</div>
            </div>
          </div>

          {/* Interactive Dashboard */}
          <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full">
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl text-[#FF6EFF]">📱</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">Interactive Dashboard</h3>
              <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
                Beautiful, intuitive interface with real-time progress tracking.
              </p>
            </div>
            <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-auto cursor-pointer">
              View Live Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIfeatures;
