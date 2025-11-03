// AboutUs.jsx
import React from "react";

function AboutUs() {
  return (
    <div className="bg-[#0A001F] text-[#D8B8FF] min-h-screen">
      {/* Hero Section */}
      <div className="relative h-52 sm:h-64 md:h-80 bg-gradient-to-r from-[#1E0A3F] to-[#0A001F] flex items-center justify-center">
        <img
          src="https://img.freepik.com/premium-photo/abstract-question-mark-background-3d-rendering_476612-22315.jpg"
          alt="about-bg"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-[#0A001F] bg-opacity-60 px-4 sm:px-6 py-2 rounded text-center">
          About Us
        </h2>
      </div>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-[#B266FF]">IntelliPrep</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#D8B8FF]/80 max-w-2xl mx-auto">
              Empowering Every Learner’s Potential with the power of AI.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
              Our Mission: Empowering Every Learner&apos;s Potential
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-[#D8B8FF]/80 leading-relaxed">
              At <span className="font-semibold text-[#B266FF]">IntelliPrep</span>, we believe
              learning should be smarter, faster, and tailored to every
              individual. Our journey began with a simple observation —
              traditional ways of learning and coding are often inefficient,
              frustrating, and rarely personalized. We founded IntelliPrep to
              change this paradigm by harnessing Artificial Intelligence to
              create an intelligent, personalized learning companion for
              everyone.
            </p>
          </div>

          {/* What We Do */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
              What We Do: Bridging the Gap Between Learning and Mastery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IntelliCode Helper */}
              <div className="bg-[#1E0A3F] shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-lg transition border border-[#D8B8FF]/30">
                <h4 className="text-lg sm:text-xl font-semibold text-[#B266FF] mb-2">
                  IntelliCode Helper
                </h4>
                <p className="text-sm sm:text-base md:text-lg text-[#D8B8FF]/80 leading-relaxed">
                  Not just a debugger — our AI-powered extension identifies
                  mistakes in real-time, explains the underlying concepts in
                  plain language, and builds a personal “weak topics” profile
                  for you. It then suggests targeted practice so you can master
                  the areas that challenge you the most.
                </p>
              </div>

              {/* IntelliPrep Exam Suite */}
              <div className="bg-[#1E0A3F] shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-lg transition border border-[#D8B8FF]/30">
                <h4 className="text-lg sm:text-xl font-semibold text-[#B266FF] mb-2">
                  IntelliPrep Exam Suite
                </h4>
                <p className="text-sm sm:text-base md:text-lg text-[#D8B8FF]/80 leading-relaxed">
                  Say goodbye to unorganized study sessions. Upload your notes,
                  past papers, or syllabus, and our AI will analyze the content
                  to highlight high-priority topics and generate a custom,
                  day-by-day study plan. Less stress, more focus, and smarter
                  preparation.
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
              Our Vision: A Smarter Future for Learning
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-[#D8B8FF]/80 leading-relaxed">
              We envision a future where education is dynamic, adaptive, and
              personalized to every learner’s needs. IntelliPrep is not just a
              tool — it’s a movement towards intelligent learning that evolves
              with you. We’re committed to continuously improving our platform,
              expanding features, and supporting more languages to help every
              learner reach their full potential.
            </p>
            <p className="text-[#B266FF] font-semibold mt-4 text-sm sm:text-base md:text-lg">
              Join us on our mission to make learning smarter, simpler, and more
              empowering.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
