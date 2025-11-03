// src/layouts/DashboardLayout.jsx
import React from "react";
import NavbarOption2 from "../Components/NavbarOption2";
import Footer from "../Components/Footer";

const DashboardLayout = ({ children }) => {
  return (
    <>
      {/* Navbar for logged-in users */}
      <NavbarOption2 />

      {/* Page content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default DashboardLayout;
