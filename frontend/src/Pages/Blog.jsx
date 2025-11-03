// Blog.jsx
import React from "react";

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#0A001F] text-[#D8B8FF]">
      {/* Hero Section */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-[#1E0A3F] to-[#0A001F] flex items-center justify-center px-4 sm:px-6 lg:px-20">
        <img
          src="https://img.freepik.com/premium-photo/artificial-intelligence-coding-concept-digital-brain-hologram-computer-code-background_476612-19291.jpg"
          alt="blog-hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <h1 className="relative text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-[#0A001F] bg-opacity-60 px-4 sm:px-6 py-2 rounded text-center">
          Stop Wasting Time: The Smart Way to Learn & Code
        </h1>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl sm:max-w-5xl mx-auto px-4 sm:px-6 lg:px-20 py-10 sm:py-16">
        <div className="bg-[#1E0A3F] shadow-2xl rounded-2xl p-6 sm:p-10 border border-[#D8B8FF]/30">
          <p className="text-sm sm:text-base md:text-lg text-center text-[#D8B8FF]/80 leading-relaxed mb-8">
            Discover how IntelliPrep is turning frustration into flow and chaos
            into clarity with AI-powered tools built for learners, coders, and
            professionals.
          </p>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              From Frustration to Flow: The AI Code Helper
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Ever been stuck on a single line of code for hours, feeling like
              you're banging your head against a wall? The AI Code Helper is here
              to change that. It’s more than just a debugger; it’s your real-time
              coding mentor that integrates directly into your workflow.
            </p>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              As you write, the extension instantly detects and flags errors. But
              instead of just saying <span className="font-semibold text-[#B266FF]">"Error on line 12"</span>, it explains{" "}
              <span className="italic">why</span> the error occurred in plain
              language. You get the corrected snippet and a clear explanation,
              helping you learn the concept and avoid repeating the same mistakes.
            </p>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed">
              Over time, our AI builds a personalized{" "}
              <span className="font-semibold text-[#B266FF]">"weak topics" profile</span>,
              focusing your practice on the concepts you struggle with most. This
              transforms debugging into meaningful learning.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Turning Chaos into Clarity: The AI Exam Prep
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Exam prep doesn’t have to feel overwhelming. With IntelliPrep’s AI
              Exam Prep, you can upload notes, past papers, or your syllabus, and
              let AI handle the heavy lifting. It analyzes your materials,
              pinpoints high-priority topics, and generates a personalized,
              day-by-day study plan.
            </p>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed">
              No more endless rereading or second-guessing. You’ll know exactly
              what to study and when, making exam prep less stressful and far more
              strategic.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              More Than Just Tools: A Partner in Your Success
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              IntelliPrep isn’t just software—it’s a partner in your growth. Our
              platform is built for:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              <li>
                <span className="font-semibold text-[#B266FF]">Students:</span> Excel in exams and
                build a strong foundation.
              </li>
              <li>
                <span className="font-semibold text-[#B266FF]">Programmers:</span> Debug faster,
                learn concepts better, and write cleaner code.
              </li>
              <li>
                <span className="font-semibold text-[#B266FF]">Professionals:</span> Upskill
                quickly to stay competitive in your career.
              </li>
            </ul>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed">
              With our unique blend of AI, web, app, and extension development,
              IntelliPrep is a comprehensive solution designed to help you learn,
              code, and succeed—faster.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-[#1E0A3F] rounded-xl p-6 sm:p-8 text-center border border-[#D8B8FF]/30">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
              Ready to Unlock Your Potential?
            </h3>
            <p className="text-sm sm:text-base md:text-lg mb-5 text-[#D8B8FF]/80">
              Stop letting small errors and disorganized study habits hold you
              back. Join IntelliPrep and transform the way you learn and code.
            </p>
            <button className="bg-[#B266FF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#FF6EFF] transition w-full sm:w-auto">
              Explore IntelliPrep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
