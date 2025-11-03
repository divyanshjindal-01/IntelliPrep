import React from 'react'
import { Link, Outlet } from "react-router-dom";


function Quizdashboard() {
  return (
    <div className='min-h-screen bg-[#0A001F] text-[#D8B8FF] p-6 pt-28'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* HTML Quiz */}
  <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full 
  hover:scale-105 hover:shadow-2xl transition duration-300">
    <div>
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl text-[#FF6EFF]">📄</span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">HTML Quiz</h3>
      <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
        Test your HTML knowledge with interactive questions and improve your skills
      </p>
    </div>
    <div className="mt-auto">
      <div className="flex justify-center space-x-2 mb-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full flex items-center justify-center text-xs sm:text-sm">📝</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-full flex items-center justify-center text-xs sm:text-sm">✅</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-400 rounded-full flex items-center justify-center text-xs sm:text-sm">⚡</div>
      </div>
      <div className="text-xs sm:text-sm font-semibold text-[#D8B8FF]">5 questions completed!</div>
    </div>
    <Link to="/htmlquiz">
      <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-4 cursor-pointer">
        Start Quiz
      </button>
    </Link>
  </div>

  {/* CSS Quiz */}
  <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full 
  hover:scale-105 hover:shadow-2xl transition duration-300">
    <div>
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl text-[#FF6EFF]">🎨</span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">CSS Quiz</h3>
      <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
        Check your CSS skills with interactive questions and challenges
      </p>
    </div>
    <div className="mt-auto">
      <div className="flex justify-center space-x-2 mb-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs sm:text-sm">💅</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full flex items-center justify-center text-xs sm:text-sm">✅</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs sm:text-sm">⚡</div>
      </div>
      <div className="text-xs sm:text-sm font-semibold text-[#D8B8FF]">4 questions completed!</div>
    </div>
    <Link to="/cssquiz">
      <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-4 cursor-pointer">
        Start Quiz
      </button>
    </Link>
  </div>

  {/* JavaScript Quiz */}
  <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full 
  hover:scale-105 hover:shadow-2xl transition duration-300">
    <div>
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl text-[#FF6EFF]">💻</span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">JavaScript Quiz</h3>
      <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
        Improve your JavaScript knowledge with fun and challenging questions
      </p>
    </div>
    <div className="mt-auto">
      <div className="flex justify-center space-x-2 mb-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-full flex items-center justify-center text-xs sm:text-sm">⚡</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs sm:text-sm">✅</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full flex items-center justify-center text-xs sm:text-sm">💡</div>
      </div>
      <div className="text-xs sm:text-sm font-semibold text-[#D8B8FF]">3 questions completed!</div>
    </div>
    <Link to="/jsquiz">
      <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-4 cursor-pointer">
        Start Quiz
      </button>
    </Link>
  </div>

  {/* React JS Quiz */}
  <div className="bg-[#1E0A3F] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#D8B8FF]/30 flex flex-col justify-between h-full 
  hover:scale-105 hover:shadow-2xl transition duration-300">
    <div>
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3A1F66] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl text-[#FF6EFF]">⚛️</span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-[#D8B8FF]">React JS Quiz</h3>
      <p className="text-sm sm:text-base text-[#D8B8FF]/80 mb-4 sm:mb-6">
        Test your React skills with components, hooks, and state management questions
      </p>
    </div>
    <div className="mt-auto">
      <div className="flex justify-center space-x-2 mb-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-400 rounded-full flex items-center justify-center text-xs sm:text-sm">⚛️</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-full flex items-center justify-center text-xs sm:text-sm">✅</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs sm:text-sm">💡</div>
      </div>
      <div className="text-xs sm:text-sm font-semibold text-[#D8B8FF]">2 questions completed!</div>
    </div>
    <Link to="/reactjsquiz">
      <button className="w-full bg-[#FF6EFF] text-[#0A001F] py-2 sm:py-3 rounded-xl font-semibold hover:bg-[#E07BFF] hover:scale-105 transition mt-4 cursor-pointer">
        Start Quiz
      </button>
    </Link>
  </div>
</div>

    </div>
  )
}

export default Quizdashboard