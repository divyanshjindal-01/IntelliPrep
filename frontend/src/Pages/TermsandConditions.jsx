import React from "react";

function TermsAndConditions() {
  return (
    <div className="bg-[#0A001F] min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative h-52 sm:h-60 md:h-72 bg-gradient-to-r from-gray-800 to-black flex items-center justify-center">
        <img
          src="https://img.freepik.com/premium-photo/legal-law-concept-gavel-scale-justice-dark-background-generative-ai_58409-25852.jpg"
          alt="terms-bg"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-[#D8B8FF] bg-black bg-opacity-60 px-4 sm:px-6 py-2 rounded">
          Terms & Conditions
        </h2>
      </div>

      {/* Terms Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-10">

          {/* Introduction */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Introduction and Acceptance of Terms
            </h3>
            <p className="text-[#D8B8FF]/80 leading-relaxed text-sm sm:text-base">
              Welcome to <span className="font-semibold text-[#B266FF]">IntelliPrep</span>. These Terms and Conditions constitute a legally binding agreement between you and IntelliPrep, a platform providing AI-powered learning and coding assistance. By accessing and using our website, mobile application, browser extensions, or any related services (collectively, the "Service"), you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree, you are not authorized to use the Service.
            </p>
          </div>

          {/* User Account */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              User Account and Responsibilities
            </h3>
            <ul className="list-disc pl-6 space-y-4 text-[#D8B8FF]/80 text-sm sm:text-base">
              <li>
                <span className="font-semibold text-[#B266FF]">Account Creation:</span> To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and keep your password secure. You are solely responsible for all activities under your account.
              </li>
              <li>
                <span className="font-semibold text-[#B266FF]">Prohibited Conduct:</span> You may not use the Service for unlawful, unauthorized, or malicious purposes. This includes attempting to gain unauthorized access to our systems, interfering with security, uploading harmful code, or harassing other users.
              </li>
              <li>
                <span className="font-semibold text-[#B266FF]">User-Provided Content:</span> You are responsible for all content you upload, including notes, code snippets, or question papers. You represent that you own or have the rights to upload such content and that it does not infringe any third-party intellectual property rights.
              </li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Intellectual Property Rights
            </h3>
            <ul className="list-disc pl-6 space-y-4 text-[#D8B8FF]/80 text-sm sm:text-base">
              <li>
                <span className="font-semibold text-[#B266FF]">Our Content:</span> All content on the Service, including software, text, graphics, logos, and technology, is the property of IntelliPrep and its licensors. You may not copy, modify, or distribute without explicit written permission.
              </li>
              <li>
                <span className="font-semibold text-[#B266FF]">Your Content:</span> You retain full ownership of your uploaded content. By uploading, you grant IntelliPrep a non-exclusive, worldwide, royalty-free license to use and analyze it solely for providing and improving the Service.
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Disclaimer of Warranties
            </h3>
            <p className="text-[#D8B8FF]/80 leading-relaxed text-sm sm:text-base">
              The Service is provided on an "as-is" and "as-available" basis. IntelliPrep makes no guarantees that the Service will be uninterrupted, error-free, or completely secure. We disclaim all warranties, express or implied, including but not limited to, implied warranties of merchantability and fitness for a particular purpose.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Limitation of Liability
            </h3>
            <p className="text-[#D8B8FF]/80 leading-relaxed text-sm sm:text-base">
              In no event shall IntelliPrep be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of, or inability to use, the Service. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses. Your sole remedy is to stop using the Service.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default TermsAndConditions;
