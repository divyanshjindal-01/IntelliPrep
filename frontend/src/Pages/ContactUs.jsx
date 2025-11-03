import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message Sent!\n\n${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 bg-[#0A001F]">
      <div className="backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-lg bg-gradient-to-br from-[#1E0A3F]/80 to-[#2B0D4F]/80 border border-[#D8B8FF]/30">
        <h2 className="text-center text-[#D8B8FF] font-bold text-2xl sm:text-3xl md:text-4xl mb-6">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-[#D8B8FF]/40 focus:ring-2 focus:ring-[#D8B8FF] outline-none text-white bg-[#0A001F] placeholder-[#D8B8FF]/60"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-[#D8B8FF]/40 focus:ring-2 focus:ring-[#D8B8FF] outline-none text-white bg-[#0A001F] placeholder-[#D8B8FF]/60"
          />

          {/* Subject */}
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-[#D8B8FF]/40 focus:ring-2 focus:ring-[#D8B8FF] outline-none text-white bg-[#0A001F] placeholder-[#D8B8FF]/60"
          />

          {/* Message */}
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            className="w-full p-3 rounded-md border border-[#D8B8FF]/40 focus:ring-2 focus:ring-[#D8B8FF] outline-none text-white bg-[#0A001F] placeholder-[#D8B8FF]/60 resize-none"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#D8B8FF] to-[#B266FF] hover:opacity-90 transition cursor-pointer"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
