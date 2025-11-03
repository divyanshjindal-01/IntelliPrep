import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const Navbar = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    setIsOpen(false); // close menu on click
    if (location.pathname === "/") {
      scroller.scrollTo(sectionId, { duration: 100, delay: 0, smooth: "easeInOutQuart", offset: -70 });
    } else {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo(sectionId, { duration: 100, delay: 0, smooth: "easeInOutQuart", offset: -70 });
      }, 100);
    }
  };

  return (
    <nav className="bg-[#0A001F] border-b border-[#25004A] px-4 sm:px-6 lg:px-10 py-3 fixed w-full z-50">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-[#D8B8FF] flex items-center gap-2">
          IntelliPrep <span className="text-[#FF6EFF]">🧠</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-base font-semibold">
          {["Hero", "features", "HowItWorks", "WhyUs"].map((section) => (
            <li key={section}>
              <button onClick={() => handleNavClick(section)} className="text-[#D8B8FF] hover:text-[#FF6EFF] transition">
                {section === "Hero" ? "Home" : section}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <Link to="/demo" className="bg-[#FF6EFF] text-[#0A001F] px-4 py-2 rounded-full font-medium hover:brightness-110 transition">
            Demo/Try Now
          </Link>
          <button onClick={onLoginClick} className="bg-[#FF6EFF] text-[#0A001F] px-4 py-2 rounded-full font-medium hover:brightness-110 transition">
            Login/Signup
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#D8B8FF]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-[#0A001F] flex flex-col gap-4 px-2 py-4 border-t border-[#25004A]">
          {["Hero", "features", "HowItWorks", "WhyUs"].map((section) => (
            <button
              key={section}
              onClick={() => handleNavClick(section)}
              className="text-[#D8B8FF] hover:text-[#FF6EFF] text-left font-semibold transition"
            >
              {section === "Hero" ? "Home" : section}
            </button>
          ))}

          <Link
            to="/demo"
            className="bg-[#FF6EFF] text-[#0A001F] px-4 py-2 rounded-full font-medium hover:brightness-110 transition"
          >
            Demo/Try Now
          </Link>
          <button
            onClick={onLoginClick}
            className="bg-[#FF6EFF] text-[#0A001F] px-4 py-2 rounded-full font-medium hover:brightness-110 transition cursor-pointer"
          >
            Login/Signup
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
