import React, { useState } from "react";

const faqs = [
  {
    question: "How does IntelliPrep's AI Code Helper work?",
    answer: "Our Code Helper integrates with your browser and code editor. It detects errors in your code, analyzes the problem using AI, and provides a clear explanation along with a corrected code snippet. It learns from your mistakes to offer personalized revision suggestions over time."
  },
  {
    question: "Which programming languages does the AI Code Helper support?",
    answer: "We currently support popular languages like Python, JavaScript, Java, C++, and more. We are continuously adding new languages based on user demand."
  },
  {
    question: "Can I use the AI Exam Prep tool for any subject?",
    answer: "Yes! The AI Exam Prep tool is designed to work with various subjects. You can upload any text-based notes, question papers, or syllabus documents, and our AI will analyze the content to create your custom study plan."
  },
  {
    question: "How do you protect the privacy of my uploaded notes and code?",
    answer: "We prioritize your privacy. All uploads are securely stored and processed. Our platform offers encrypted storage and follows strict data protection guidelines."
  },
  {
    question: "Is IntelliPrep a free service?",
    answer: "We offer a free tier with essential features so you can experience the power of our platform. For full access to all features, including unlimited code help and advanced study plans, we offer premium subscription plans. You can find more details on our pricing page."
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="FAQ" className="flex flex-col min-h-screen bg-[#0A001F]">
      {/* Hero Section */}
      <div className="relative h-52 sm:h-60 md:h-72 bg-gradient-to-r from-gray-800 to-black flex items-center justify-center">
        <img
          src="https://img.freepik.com/premium-photo/abstract-question-mark-background-3d-rendering_476612-22315.jpg"
          alt="faq-bg"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <h2 className="relative text-[#D8B8FF] text-2xl sm:text-3xl md:text-4xl font-bold bg-black bg-opacity-60 px-4 sm:px-6 py-2 rounded">
          FAQs
        </h2>
      </div>

      {/* FAQ Section */}
      <div className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#D8B8FF]/30 rounded-lg shadow-lg bg-[#1E0A3F]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-4 sm:px-6 py-3 font-medium text-left text-[#D8B8FF] hover:text-[#B266FF] transition text-sm sm:text-base"
              >
                {faq.question}
                <span className="text-[#B266FF] text-xl">{openIndex === index ? "-" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 text-[#D8B8FF]/80 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
