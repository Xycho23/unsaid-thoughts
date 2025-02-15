"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/app/firebaseConfig"; // Import auth from firebaseConfig
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth functions directly

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
      await createUserWithEmailAndPassword(auth, email, password); // Use auth from firebaseConfig
      setOverlayContent("loginSuccess");
      setTimeout(() => router.push("/homepage"), 2000); // Redirect after 2 seconds
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
      await signInWithEmailAndPassword(auth, email, password); // Use auth from firebaseConfig
      setOverlayContent("loginSuccess");
      setTimeout(() => router.push("/homepage"), 2000); // Redirect after 2 seconds
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
      <h1 className="text-5xl font-extrabold mb-6 text-[#bcaaa4] text-center">Welcome to Unsaid Thoughts</h1>

      {/* Login/Register Form */}
      <div className="bg-[#5d4037] p-10 rounded-lg shadow-xl border-8 border-[#8d6e63] w-full max-w-md">
        {isLogin ? (
          <>
            <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-3 rounded bg-[#d7ccc8] text-[#3e2723]"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-3 rounded bg-[#d7ccc8] text-[#3e2723]"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-[#bcaaa4] p-3 rounded text-[#3e2723] hover:bg-[#a1887f] transition-colors duration-200"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="mt-4 text-center">
              Don&apos;t have an account?{" "}
              <span className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63]" onClick={() => setIsLogin(false)}>
                Register
              </span>
            </p>
            <p className="mt-2 text-center">
              <span className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63]">Forgot Password?</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4 text-center">Register</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-3 rounded bg-[#d7ccc8] text-[#3e2723]"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-3 rounded bg-[#d7ccc8] text-[#3e2723]"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center mb-3">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <span
                  className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63]"
                  onClick={() => {
                    setOverlayContent("privacy");
                    setShowOverlay(true);
                  }}
                >
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span
                  className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63]"
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
              className="w-full bg-[#bcaaa4] p-3 rounded text-[#3e2723] hover:bg-[#a1887f] transition-colors duration-200"
              onClick={handleRegister}
            >
              Register
            </button>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <span className="text-[#bcaaa4] cursor-pointer hover:text-[#8d6e63]" onClick={() => setIsLogin(true)}>
                Login
              </span>
            </p>
          </>
        )}
      </div>

      {/* Info Buttons Below Form */}
      <div className="flex gap-4 mt-6">
        <button
          className="text-sm text-[#bcaaa4] hover:text-[#8d6e63] transition-colors duration-200"
          onClick={() => {
            setOverlayContent("about");
            setShowOverlay(true);
          }}
        >
          About Us
        </button>
        <button
          className="text-sm text-[#bcaaa4] hover:text-[#8d6e63] transition-colors duration-200"
          onClick={() => {
            setOverlayContent("privacy");
            setShowOverlay(true);
          }}
        >
          Privacy Policy
        </button>
        <button
          className="text-sm text-[#bcaaa4] hover:text-[#8d6e63] transition-colors duration-200"
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
              className="bg-[#5d4037] p-6 rounded-lg shadow-lg border-2 border-[#8d6e63] max-w-md text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {overlayContent === "about" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">About Unsaid Thoughts</h2>
                  <p className="mb-4">
                    Unsaid Thoughts is a platform where you can share your deepest thoughts anonymously and get responses from others.
                  </p>
                </>
              )}
              {overlayContent === "privacy" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                  <p className="mb-4">
                    Your privacy is important to us. We do not share your personal information with third parties.
                  </p>
                </>
              )}
              {overlayContent === "contact" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                  <p className="mb-4">
                    For any inquiries, please email us at <span className="text-[#bcaaa4]">support@unsaidthoughts.com</span>.
                  </p>
                </>
              )}
              {overlayContent === "loginSuccess" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Success!</h2>
                  <p className="mb-4">You have successfully logged in. Redirecting to the homepage...</p>
                </>
              )}
              {overlayContent === "loginError" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Error</h2>
                  <p className="mb-4">{errorMessage}</p>
                </>
              )}
              <button
                className="bg-[#bcaaa4] p-2 rounded text-[#3e2723] hover:bg-[#a1887f] transition-colors duration-200"
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