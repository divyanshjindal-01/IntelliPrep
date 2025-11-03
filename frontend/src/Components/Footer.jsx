import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

export default function Footer({ onSignupClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeSectionClick = (sectionId) => {
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate(`/?scrollTo=${sectionId}`);
    }
  };

  const handlePageLinkClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A001F] py-12 sm:py-16 border-t border-[#D8B8FF]/20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
        
        {/* Logo & Description */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleHomeSectionClick("Hero")}
            className="text-2xl sm:text-3xl font-bold flex items-center gap-2 cursor-pointer text-[#D8B8FF] hover:text-[#B266FF] transition"
          >
            IntelliPrep <span className="text-[#FF6EFF]">🧠</span>
          </button>
          <p className="text-[#D8B8FF]/70 text-sm sm:text-base">
            “Making learning simple, smart, and effective.”
          </p>
        </div>

        {/* Main Column */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-4 text-[#D8B8FF]">Main</h2>
          <ul className="flex flex-col space-y-2 text-sm sm:text-base text-[#D8B8FF]/70">
            <li>
              <button
                onClick={() => handleHomeSectionClick("Hero")}
                className="hover:text-[#B266FF] hover:underline cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageLinkClick("/faq")}
                className="hover:text-[#B266FF] hover:underline cursor-pointer"
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageLinkClick("/blog")}
                className="hover:text-[#B266FF] hover:underline"
              >
                Blog
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageLinkClick("/about")}
                className="hover:text-[#B266FF] hover:underline"
              >
                About
              </button>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-4 text-[#D8B8FF]">Support</h2>
          <ul className="flex flex-col space-y-2 text-sm sm:text-base text-[#D8B8FF]/70">
            <li>
              <button
                onClick={() => handlePageLinkClick("/terms")}
                className="hover:text-[#B266FF] hover:underline"
              >
                Terms & Conditions
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageLinkClick("/help")}
                className="hover:text-[#B266FF] hover:underline"
              >
                Help Center
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageLinkClick("/contact")}
                className="hover:text-[#B266FF] hover:underline"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-4 text-[#D8B8FF]">Legal</h2>
          <ul className="flex flex-col space-y-2 text-sm sm:text-base text-[#D8B8FF]/70">
            <li>
              <button
                onClick={() => handlePageLinkClick("/privacy")}
                className="hover:text-[#B266FF] hover:underline"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Community Column */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-4 text-[#D8B8FF]">Community</h2>
          <ul className="flex flex-col space-y-2 text-sm sm:text-base text-[#D8B8FF]/70">
            <li>
              <button
                onClick={() => handlePageLinkClick("/community")}
                className="hover:text-[#B266FF] hover:underline"
              >
                Community
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 text-center text-xs sm:text-sm text-[#D8B8FF]/50 border-t border-[#D8B8FF]/20 pt-6">
        © {new Date().getFullYear()} IntelliPrep. All rights reserved.
      </div>
    </footer>
  );
}
