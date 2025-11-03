import React, { useState } from "react";

const HelpCenter = () => {
  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Issue: ${issue}\nMessage: ${message}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0A001F] px-4 sm:px-6">
      <div className="bg-[#1E0A3F]/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#D8B8FF]/30">
        <h2 className="text-center text-[#D8B8FF] font-bold text-2xl sm:text-3xl mb-6">
          Support
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown */}
          <select
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-[#D8B8FF]/50 bg-[#0A001F] text-[#D8B8FF] focus:ring-2 focus:ring-[#B266FF] outline-none text-sm sm:text-base"
          >
            <option value="">Select Issue</option>
            <option value="login">Login Problem</option>
            <option value="payment">Payment Issue</option>
            <option value="bug">Report a Bug</option>
            <option value="other">Other</option>
          </select>

          {/* Textarea */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue..."
            required
            className="w-full p-3 rounded-md border border-[#D8B8FF]/50 bg-[#0A001F] text-[#D8B8FF] focus:ring-2 focus:ring-[#B266FF] outline-none resize-none text-sm sm:text-base"
            rows="4"
          ></textarea>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-medium bg-gradient-to-r from-[#D8B8FF] to-[#B266FF] hover:opacity-90 transition cursor-pointer text-sm sm:text-base"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpCenter;
