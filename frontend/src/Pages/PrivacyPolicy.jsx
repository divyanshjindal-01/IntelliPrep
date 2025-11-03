import React from "react";

function PrivacyPolicy() {
  return (
    <div className="bg-[#0A001F] min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative h-52 sm:h-60 md:h-72 bg-gradient-to-r from-gray-800 to-black flex items-center justify-center">
        <img
          src="https://img.freepik.com/premium-photo/data-protection-cyber-security-privacy-concept-lock-icon-digital-background-3d-rendering_476612-21806.jpg"
          alt="privacy-bg"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-[#D8B8FF] bg-black bg-opacity-60 px-4 sm:px-6 py-2 rounded">
          Privacy Policy
        </h2>
      </div>

      {/* Privacy Policy Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-10">
          {/* Introduction */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Introduction
            </h3>
            <p className="text-[#D8B8FF]/90 leading-relaxed text-sm sm:text-base">
              This Privacy Policy explains how{" "}
              <span className="font-semibold text-[#D8B8FF]">IntelliPrep</span> collects, uses,
              and protects your personal information when you use our Service.
              We are committed to safeguarding your privacy and ensuring the
              security of your data. By using IntelliPrep, you agree to the
              collection and use of your information in accordance with this
              policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Information We Collect
            </h3>
            <ul className="list-disc pl-6 space-y-4 text-[#D8B8FF]/80 text-sm sm:text-base">
              <li>
                <span className="font-semibold">Personal Information:</span> When you create an account, we collect information such as your name and email address.
              </li>
              <li>
                <span className="font-semibold">Usage Data:</span> Includes your interactions with the Service such as coding errors, uploaded documents, quiz activity, and engagement with features.
              </li>
              <li>
                <span className="font-semibold">Technical Data:</span> IP address, browser type, OS, device identifiers, etc.
              </li>
              <li>
                <span className="font-semibold">Cookies & Tracking:</span> Used to remember preferences and analyze behavior.
              </li>
            </ul>
          </div>

          {/* How We Use Info */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              How We Use Your Information
            </h3>
            <ul className="list-disc pl-6 space-y-4 text-[#D8B8FF]/80 text-sm sm:text-base">
              <li>Provide and maintain the Service, including AI code help and study plans.</li>
              <li>Analyze performance and offer targeted learning suggestions.</li>
              <li>Improve the Service by understanding feature usage.</li>
              <li>Communicate updates and new features.</li>
              <li>Ensure security and prevent fraud.</li>
            </ul>
          </div>

          {/* Data Security */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Data Security
            </h3>
            <p className="text-[#D8B8FF]/90 leading-relaxed text-sm sm:text-base">
              We implement strict security measures including encryption, secure servers, and access controls. However, no method is completely secure.
            </p>
          </div>

          {/* Data Sharing */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#B266FF] mb-3">
              Data Sharing and Disclosure
            </h3>
            <p className="text-[#D8B8FF]/90 leading-relaxed text-sm sm:text-base">
              We do not sell or trade your personal information. Data may be shared with trusted third-party providers bound to protect it, or disclosed if required by law.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
