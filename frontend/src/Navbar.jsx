import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-3 bg-white border-b-2 border-black">
      {/* Logo */}
      <div className="h-16 w-24 flex items-center">
        <img src="Logo.png" alt="Logo" className="h-full w-full object-contain object-center" />
      </div>

      {/* Nav Links */}
      <ul className="flex gap-6 list-none text-base font-semibold m-0 p-0">
        <li><a href="#" className="text-black hover:text-gray-600">Home</a></li>
        <li><a href="#" className="text-black hover:text-gray-600">Features</a></li>
        <li><a href="#" className="text-black hover:text-gray-600">How It Works</a></li>
        <li><a href="#" className="text-black hover:text-gray-600">Why Us</a></li>
      </ul>

      {/* Buttons */}
      <div className="flex gap-4">
        <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium transition hover:bg-gray-700">
          Demo/Try Now
        </button>
        <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium transition hover:bg-gray-700">
          Login/Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
