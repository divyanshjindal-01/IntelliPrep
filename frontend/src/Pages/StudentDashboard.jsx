import React from "react";
import { motion } from "framer-motion";

const StudentDashboard = () => {
const weakTopics = ["React Hooks", "Firebase Auth", "Array Methods"];
const suggestions = [
"Practice React useEffect examples",
"Watch tutorial on Firebase setup",
"Solve JS array-based problems",
];

return (
<div className="min-h-screen bg-[#0A001F] text-[#D8B8FF] p-6 pt-24">
<h1 className="text-3xl font-bold text-[#FF6EFF] mb-10 text-center">
🎓 Student Dashboard
</h1>

  {/* -------- GRID 1 -------- */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    {/* Profile Card */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#1E0A3F] border border-[#D8B8FF]/30 rounded-3xl shadow-lg p-6 flex flex-col items-start"
    >
      <div className="flex items-center gap-5 mb-4">
        <div className="w-24 h-24 bg-[#3A1F66] rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#FF6EFF]">
            Dev Aryan
          </h2>
          <p className="text-[#D8B8FF]/70 text-sm mb-2">
            BCA Student | Frontend Learner
          </p>
          <p className="text-sm">📧 dev.aryan@example.com</p>
        </div>
      </div>

      <div className="w-full bg-[#2E1A57] rounded-lg p-3 mt-auto">
        <p className="text-sm mb-1">XP Progress</p>
        <div className="w-full bg-[#3A1F66] h-3 rounded-lg">
          <div className="h-3 bg-[#FF6EFF] rounded-lg w-[70%]" />
        </div>
        <p className="text-sm mt-2">Level 7 • 580 / 800 XP</p>
      </div>
    </motion.div>

    {/* Learning Time */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#1E0A3F] border border-[#D8B8FF]/30 rounded-3xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-[#FF6EFF] mb-3">
        Learning Time (Today)
      </h2>
      <p className="text-3xl font-bold mb-4">⏱ 2h 35m</p>
      <ul className="text-sm space-y-2">
        <li>📘 Reading — 30%</li>
        <li>🎥 Video — 25%</li>
        <li>✍️ Writing — 20%</li>
        <li>🧩 Assignment — 25%</li>
      </ul>
    </motion.div>

    {/* My Activity */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#1E0A3F] border border-[#D8B8FF]/30 rounded-3xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-[#FF6EFF] mb-3">
        My Activity (Weekly)
      </h2>
      <div className="h-32 w-full bg-[#3A1F66]/50 rounded-lg flex items-center justify-center text-[#D8B8FF]/70">
        📊 Activity Graph Placeholder
      </div>
      <p className="text-sm mt-3 text-[#D8B8FF]/70">
        You were most active on Wednesday 🚀
      </p>
    </motion.div>
  </div>

  {/* -------- GRID 2 -------- */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Weak Topic Tracker */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#1E0A3F] border border-[#D8B8FF]/30 rounded-3xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-[#FF6EFF] mb-3">
        Weak Topic Tracker
      </h2>
      <ul className="text-sm space-y-2">
        {weakTopics.map((topic, i) => (
          <li key={i}>⚠️ {topic}</li>
        ))}
      </ul>
    </motion.div>

    {/* Calendar */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#1E0A3F] border border-[#D8B8FF]/30 rounded-3xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-[#FF6EFF] mb-3">
        Calendar
      </h2>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>(
          <span key={i} className="font-semibold text-[#FF6EFF]">{d}</span>
        ))}
        {Array.from({ length: 31 }, (_, i) => (
          <span
            key={i}
            className="p-1 hover:bg-[#FF6EFF]/20 rounded-lg cursor-pointer"
          >
            {i + 1}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-[#D8B8FF]/70">
        📅 Upcoming Task: Submit assignment (Nov 1)
      </p>
    </motion.div>

    {/* Practice Suggestions */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#1E0A3F] border border-[#D8B8FF]/30 rounded-3xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-[#FF6EFF] mb-3">
        Practice Suggestions
      </h2>
      <ul className="text-sm space-y-2">
        {suggestions.map((s, i) => (
          <li key={i}>💡 {s}</li>
        ))}
      </ul>
    </motion.div>
  </div>
</div>


);
};

export default StudentDashboard;