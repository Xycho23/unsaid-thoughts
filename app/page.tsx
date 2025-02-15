"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/app/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayContent, setOverlayContent] = useState<"about" | "privacy" | "contact" | "loginSuccess" | "loginError" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setOverlayContent("loginSuccess");
      setTimeout(() => router.push("/homepage"), 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setOverlayContent("loginError");
      } else {
        setErrorMessage("An unknown error occurred");
        setOverlayContent("loginError");
      }
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOverlayContent("loginSuccess");
      setTimeout(() => router.push("/homepage"), 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setOverlayContent("loginError");
      } else {
        setErrorMessage("An unknown error occurred");
        setOverlayContent("loginError");
      }
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setOverlayContent(null);
    setErrorMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#3e2723] text-[#d7ccc8] p-6">
      <h1 className="text-6xl font-extrabold mb-8 text-[#bcaaa4] text-center">Welcome to Unsaid Thoughts</h1>

      {/* Login/Register Form */}
      <div className="bg-[#5d4037] p-8 rounded-lg shadow-xl border-4 border-[#8d6e63] w-full max-w-lg">
        {isLogin ? (
          <>
            <h2 className="text-4xl font-bold mb-6 text-center">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 mb-4 rounded-lg bg-[#d7ccc8] text-[#3e2723] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 mb-4 rounded-lg bg-[#d7ccc8] text-[#3e2723] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-[#bcaaa4] p-4 rounded-lg text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="mt-6 text-center text-lg">
              Don&apos;t have an account?{" "}
              <span className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63] font-semibold" onClick={() => setIsLogin(false)}>
                Register
              </span>
            </p>
            <p className="mt-2 text-center text-lg">
              <span className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63] font-semibold">Forgot Password?</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold mb-6 text-center">Register</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 mb-4 rounded-lg bg-[#d7ccc8] text-[#3e2723] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 mb-4 rounded-lg bg-[#d7ccc8] text-[#3e2723] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center mb-4">
              <input type="checkbox" id="terms" className="mr-2 w-5 h-5" />
              <label htmlFor="terms" className="text-lg">
                I agree to the{" "}
                <span
                  className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63] font-semibold"
                  onClick={() => {
                    setOverlayContent("privacy");
                    setShowOverlay(true);
                  }}
                >
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span
                  className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63] font-semibold"
                  onClick={() => {
                    setOverlayContent("privacy");
                    setShowOverlay(true);
                  }}
                >
                  Privacy Policy
                </span>
              </label>
            </div>
            <button
              className="w-full bg-[#bcaaa4] p-4 rounded-lg text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
              onClick={handleRegister}
            >
              Register
            </button>
            <p className="mt-6 text-center text-lg">
              Already have an account?{" "}
              <span className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63] font-semibold" onClick={() => setIsLogin(true)}>
                Login
              </span>
            </p>
          </>
        )}
      </div>

      {/* Info Buttons Below Form */}
      <div className="flex gap-6 mt-8">
        <button
          className="text-lg text-[#bcaaa4] hover:text-[#8d6e63] transition-colors duration-200 font-semibold"
          onClick={() => {
            setOverlayContent("about");
            setShowOverlay(true);
          }}
        >
          About Us
        </button>
        <button
          className="text-lg text-[#bcaaa4] hover:text-[#8d6e63] transition-colors duration-200 font-semibold"
          onClick={() => {
            setOverlayContent("privacy");
            setShowOverlay(true);
          }}
        >
          Privacy Policy
        </button>
        <button
          className="text-lg text-[#bcaaa4] hover:text-[#8d6e63] transition-colors duration-200 font-semibold"
          onClick={() => {
            setOverlayContent("contact");
            setShowOverlay(true);
          }}
        >
          Contact Us
        </button>
      </div>

      {/* Overlay for About, Privacy, Contact, Login Success/Error */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#5d4037] p-8 rounded-lg shadow-lg border-4 border-[#8d6e63] max-w-lg w-full mx-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {overlayContent === "about" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">About Unsaid Thoughts</h2>
                  <p className="text-lg mb-6">
                    Unsaid Thoughts is a platform where you can share your deepest thoughts anonymously and get responses from others.
                  </p>
                </>
              )}
              {overlayContent === "privacy" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h2>
                  <p className="text-lg mb-6">
                    Your privacy is important to us. We do not share your personal information with third parties.
                  </p>
                </>
              )}
              {overlayContent === "contact" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
                  <p className="text-lg mb-6">
                    For any inquiries, please email us at{" "}
                    <span className="text-[#bcaaa4] font-semibold">support@unsaidthoughts.com</span>.
                  </p>
                </>
              )}
              {overlayContent === "loginSuccess" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">Success!</h2>
                  <p className="text-lg mb-6">You have successfully logged in. Redirecting to the homepage...</p>
                </>
              )}
              {overlayContent === "loginError" && (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-center">Error</h2>
                  <p className="text-lg mb-6">{errorMessage}</p>
                </>
              )}
              <button
                className="w-full bg-[#bcaaa4] p-4 rounded-lg text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
                onClick={closeOverlay}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}