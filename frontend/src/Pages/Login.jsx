import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft, FaEye, FaEyeSlash } from "react-icons/fa";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  microsoftProvider,
} from "../config/firebaseConfig.js";

const Login = ({ closeModal, onLoginSuccess, onSwitch /* call onSwitch('signup') to open signup */ }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back to Intelliprep!", { position: "top-center" });
      closeModal?.();
      onLoginSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Login failed! Please try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider, label) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success(`Signed in with ${label}`, { position: "top-center" });
      closeModal?.();
      onLoginSuccess?.();
    } catch (error) {
      console.error(error);
      if (error?.code === "auth/account-exists-with-different-credential") {
        toast.error("Account exists with another sign-in method", { position: "top-center" });
      } else {
        toast.error(`${label} login failed`, { position: "top-center" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#150824] p-8 text-white shadow-2xl border border-transparent">
        {/* close */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-300 hover:text-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => socialLogin(googleProvider, "Google")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22102f]/50 hover:scale-105 transition"
            aria-label="Google"
          >
            <FcGoogle size={22} />
          </button>
          <button
            onClick={() => socialLogin(githubProvider, "GitHub")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22102f]/50 hover:scale-105 transition"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </button>
          <button
            onClick={() => socialLogin(microsoftProvider, "Microsoft")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22102f]/50 hover:scale-105 transition"
            aria-label="Microsoft"
          >
            <FaMicrosoft size={18} />
          </button>
        </div>

        <h2 className="text-center text-2xl font-semibold text-[#e9c6ff] mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full bg-[#25112b] px-6 py-3 placeholder:text-[#ad86c9] border border-[#4b2b5a] focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full bg-[#25112b] px-6 py-3 placeholder:text-[#ad86c9] border border-[#4b2b5a] focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b691e6]"
              aria-label="Toggle password visibility"
            >
              {showPw ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-[#b86bff] to-[#ff7ad9] px-6 py-3 font-semibold text-black shadow-inner"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#cbb3e6]">
          Don't have an account?{" "}
          <button
            onClick={() => onSwitch?.("signup")}
            className="font-semibold text-[#f7a1ff] underline"
          >
            Sign Up
          </button>
        </p>

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default Login;
