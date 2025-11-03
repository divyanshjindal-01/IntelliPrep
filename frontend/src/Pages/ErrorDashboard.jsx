import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { auth, githubProvider, db } from "../config/firebaseConfig";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const ErrorDashboard = () => {
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // for toggle expand analyze text

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchErrorData();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
      await fetchErrorData();
    } catch (error) {
      console.error("GitHub login failed:", error);
    }
  };

  const fetchErrorData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "debugBuddyResults"));
      const errors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setErrorData(errors);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setUserImage(URL.createObjectURL(file));
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A001F] flex flex-col items-center justify-center text-[#D8B8FF]">
        <h1 className="text-3xl font-bold mb-6 text-[#FF6EFF]">
          Welcome to IntelliPrep 👋
        </h1>
        <button
          onClick={handleLogin}
          className="bg-[#FF6EFF] text-[#0A001F] px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all"
        >
          Sign in with GitHub
        </button>
      </div>
      
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A001F] flex items-center justify-center text-[#D8B8FF]">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A001F] text-[#D8B8FF] p-6 pt-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-[#FF6EFF]/70 shadow-lg overflow-hidden bg-[#3A1F66] flex items-center justify-center text-[#D8B8FF]/50 cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            {userImage ? (
              <img
                src={userImage}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">➕</span>
            )}
          </motion.div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="user-avatar-input"
          />
          <label htmlFor="user-avatar-input" className="cursor-pointer">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FF6EFF]">
              Welcome, {user.displayName || "User"} 👋
            </h1>
            <p className="text-[#D8B8FF]/70 text-sm">
              Click the + to upload your avatar
            </p>
          </label>
        </div>

        <button
          onClick={fetchErrorData}
          className="bg-[#FF6EFF] text-[#0A001F] px-3 py-2 rounded-lg text-sm font-semibold shadow-md hover:scale-105 transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 🔹 Recent Errors */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#1E0A3F] border border-[#D8B8FF]/30 shadow-lg rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-[#FF6EFF] mb-3 flex items-center gap-2">
            ⚠️ Recent Errors
          </h2>
          {errorData.length === 0 ? (
            <p>No errors found.</p>
          ) : (
            errorData.map((err) => (
              <div
                key={err.id}
                className="text-[15px] mb-2 flex items-center gap-2 bg-[#2B1455]/60 p-2 rounded-lg"
              >
                🧩 {err.errorType || "Unknown Error"}
              </div>
            ))
          )}
        </motion.div>

        {/* 🔹 Languages Used */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#1E0A3F] border border-[#D8B8FF]/30 shadow-lg rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-[#FF6EFF] mb-3 flex items-center gap-2">
            💻 Languages Used
          </h2>
          {errorData.length === 0 ? (
            <p>No data.</p>
          ) : (
            [...new Set(errorData.map((err) => err.language || "N/A"))].map(
              (lang, i) => (
                <p
                  key={i}
                  className="text-[15px] mb-2 flex items-center gap-2 bg-[#2B1455]/60 p-2 rounded-lg"
                >
                  🌐 {lang}
                </p>
              )
            )
          )}
        </motion.div>

        {/* 🔹 Code History */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#1E0A3F] border border-[#D8B8FF]/30 shadow-lg rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-[#FF6EFF] mb-3 flex items-center gap-2">
            🕒 Code History
          </h2>
          {errorData.length === 0 ? (
            <p>No code history found.</p>
          ) : (
            errorData.map((err, i) => (
              <p
                key={i}
                className="text-[15px] mb-2 flex items-center gap-2 bg-[#2B1455]/60 p-2 rounded-lg"
              >
                ⏰ {err.timestamp || "No timestamp"}
              </p>
            ))
          )}
        </motion.div>

        {/* 🔹 Analyze */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#1E0A3F] border border-[#D8B8FF]/30 shadow-lg rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-[#FF6EFF] mb-3 flex items-center gap-2">
            🧠 Debug Analysis
          </h2>
          {errorData.length === 0 ? (
            <p>No analysis data found.</p>
          ) : (
            errorData.map((err) => {
              const isExpanded = expandedId === err.id;
              return (
                <div
                  key={err.id}
                  className="text-[15px] mb-3 bg-[#2B1455]/60 p-3 rounded-lg cursor-pointer hover:bg-[#3B1B77]/60 transition-all"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : err.id)
                  }
                >
                  {isExpanded
                    ? `💡 ${err.analyze || "No analysis available."}`
                    : `💡 ${truncateText(err.analyze || "No analysis available.", 100)}`}
                  {!isExpanded && err.analyze?.length > 100 && (
                    <span className="text-[#FF6EFF]/80 text-xs ml-1">
                      (click to expand)
                    </span>
                  )}
                </div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorDashboard;
