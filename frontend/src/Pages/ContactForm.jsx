import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    message: "",
    terms: false,
    newsletter: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-16 bg-[#0A001F] rounded-3xl shadow-2xl border border-[#D8B8FF]/30">
      <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-[#D8B8FF] text-center mb-4">
        Contact Us
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-[#D8B8FF]/80 text-center mb-8">
        Get in touch and we’ll get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[#D8B8FF] font-semibold mb-1 block">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-[#1E0A3F] border border-[#D8B8FF]/30 text-[#D8B8FF] focus:outline-none focus:ring-2 focus:ring-[#B266FF]"
            />
          </div>
          <div>
            <label className="text-[#D8B8FF] font-semibold mb-1 block">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-[#1E0A3F] border border-[#D8B8FF]/30 text-[#D8B8FF] focus:outline-none focus:ring-2 focus:ring-[#B266FF]"
            />
          </div>
        </div>

        {/* Email & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[#D8B8FF] font-semibold mb-1 block">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-[#1E0A3F] border border-[#D8B8FF]/30 text-[#D8B8FF] focus:outline-none focus:ring-2 focus:ring-[#B266FF]"
            />
          </div>
          <div>
            <label className="text-[#D8B8FF] font-semibold mb-1 block">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-[#1E0A3F] border border-[#D8B8FF]/30 text-[#D8B8FF] focus:outline-none focus:ring-2 focus:ring-[#B266FF]"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-[#D8B8FF] font-semibold mb-1 block">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl bg-[#1E0A3F] border border-[#D8B8FF]/30 text-[#D8B8FF] focus:outline-none focus:ring-2 focus:ring-[#B266FF] resize-none h-32"
          ></textarea>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col space-y-2">
          <label className="flex items-center gap-2 text-[#D8B8FF] flex-wrap">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              required
              className="accent-[#B266FF]"
            />
            I accept the{" "}
            <a href="#" className="underline text-[#B266FF]">
              terms and conditions
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-[#B266FF]">
              privacy policy
            </a>
            .
          </label>

          <label className="flex items-center gap-2 text-[#D8B8FF] flex-wrap">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
              className="accent-[#B266FF]"
            />
            Keep me up to date with the latest IntelliPrep news
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full sm:w-auto py-3 px-6 rounded-3xl bg-gradient-to-r from-[#B266FF] to-[#FF6EFF] text-white font-semibold hover:opacity-90 transition"
        >
          Submit your question
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
