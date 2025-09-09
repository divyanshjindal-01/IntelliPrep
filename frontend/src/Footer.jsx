import React from "react";
import { FaFacebook, FaTwitter, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";

const Footer = () => {
  return (
    <footer className="relative bg-white px-10 py-10 border-t border-gray-300">
      <div className="flex justify-between items-start flex-wrap gap-8">
        {/* Logo Section */}
        <div className="max-w-[220px]">
          <div className="h-24 w-24 flex items-center mb-3">
            <img
              src="Logo.png"
              alt="Logo"
              className="h-full w-full object-contain object-center"
            />
          </div>
          <p className="text-lg text-gray-700">
            “Making learning simple, smart, and effective.”
          </p>
        </div>

        {/* Helpful Links */}
        <div className="min-w-[150px]">
          <h3 className="text-lg font-bold mb-3">Helpful Links</h3>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">FAQ</li>
            <li className="hover:text-blue-600 cursor-pointer">Blog</li>
            <li className="hover:text-blue-600 cursor-pointer">About</li>
            <li className="hover:text-blue-600 cursor-pointer">Register</li>
          </ul>
        </div>

        {/* Support */}
        <div className="min-w-[150px]">
          <h3 className="text-lg font-bold mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="hover:text-blue-600 cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-blue-600 cursor-pointer">Help Center</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-600 cursor-pointer">Community</li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="min-w-[150px]">
          <h3 className="text-lg font-bold mb-3">Links</h3>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
              Facebook <FaFacebook />
            </li>
            <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
              Twitter <FaTwitter />
            </li>
            <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
              YouTube <IoLogoYoutube />
            </li>
            <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
              Instagram <FaInstagramSquare />
            </li>
            <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
              Linkedin <FaLinkedin />
            </li>
          </ul>
        </div>
      </div>

      {/* Chat Bot Button */}
      <div className="absolute right-8 bottom-8 bg-gray-900 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-center text-xs cursor-pointer hover:bg-gray-700">
        AI Chat Bot
      </div>
    </footer>
  );
};

export default Footer;
