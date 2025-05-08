"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL;



export default function SignupPage() {
  const router = useRouter();
  // *** MODIFICATION: Added isValid and mode: 'onChange' ***
  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    mode: 'onChange' // Validate on change for immediate feedback
  });
  

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [signupAllowed, setSignupAllowed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // Start timer at 0 initially
  

  // *** MODIFICATION: Watch only the password for comparison ***
  const password = watch("password");
  // Removed watch for name, emailVal as isValid handles the overall state


  // --- Effects ---
  useEffect(() => {
    // Fetch signup status
    fetch(`${API}/api/admin/status`)
      .then((res) => res.json())
      .then((data) => setSignupAllowed(data.signup_allowed))
      .catch(() => {
        console.error("Failed to fetch signup status, assuming disabled.");
        setSignupAllowed(false);
      });
  }, []);

  useEffect(() => {
    // Resend Timer Logic
    let interval: NodeJS.Timeout | null = null;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false); // Re-enable button when timer hits 0
    }
    // Cleanup interval on component unmount or when timer stops/resets
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, resendDisabled]);


  // --- Validation Helper ---
  // Still needed for the custom validation rule within register
  const passwordHasSpecialChar = (pwd: string): boolean => {
    if (!pwd) return false;
    const specialCharCount = (pwd.match(/[^a-zA-Z0-9]/g) || []).length;
    return specialCharCount >= 1;
  };

  // --- REMOVED: Custom isFormValid function is no longer needed ---
  // const isFormValid = (): boolean => { ... };

  // --- Timers ---
  const startResendTimer = () => {
    setResendTimer(30); // Reset timer to 30 seconds
    setResendDisabled(true); // Disable button
  };

  // --- API Handlers ---
  const onSubmit = async (data: any) => {
     // *** MODIFICATION: Remove confirmPassword before sending ***
     const { confirmPassword, ...signupData } = data;

    if (!signupAllowed) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setEmail(signupData.email); // Use email from signupData

    try {
      const response = await axios.post(`${API}/api/signup`, signupData, { // Send signupData
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        setOtpSent(true);
        startResendTimer(); // Start timer only on successful OTP request
      } else {
        setErrorMessage(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An unexpected error occurred.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) { // Basic check, adjust length if needed
      setErrorMessage("Please enter a valid OTP.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API}/api/verify-otp`, { email, otp });
      if (response.data.success) {
        router.push("/login");
      } else {
        setErrorMessage(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "OTP verification failed.");
      console.error("OTP Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;

    setLoading(true); // Show loading state on resend button maybe? Optional.
    setErrorMessage("");

    try {
      const response = await axios.post(`${API}/api/resend-otp`, { email });
      if (response.data.success) {
        startResendTimer(); // Restart timer
      } else {
        setErrorMessage(response.data.message || "Failed to resend OTP.");
      }
    } catch (error: any) {
      setErrorMessage("Failed to resend OTP due to network or server issue.");
      console.error("Resend OTP error:", error);
    } finally {
       setLoading(false); // Stop loading state
    }
  };

  // --- Styles (Unchanged) ---
  const inputStyle = "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a8098]/50 transition duration-200";
  const buttonBaseStyle = "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl backdrop-blur-md shadow-lg border border-white/20 hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-in-out group font-semibold";
  const primaryButtonStyle = `${buttonBaseStyle} bg-[#0a8098]/80 hover:bg-[#0a8098]/100 text-white`;
  const disabledButtonStyle = `${buttonBaseStyle} bg-white/10 text-gray-400 cursor-not-allowed opacity-70`;
  const secondaryButtonStyle = "w-full text-center text-[#0a8098] hover:text-cyan-300 mt-4 text-sm disabled:text-gray-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-200 relative overflow-hidden p-4">

      {/* Back to Home Link (optional) */}
      {/* <Link href="/" passHref>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-4 left-4 bg-white/10 border border-white/20 text-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition z-50"
          aria-label="Back to Home"
        >
          ← Back to Home
        </motion.button>
      </Link> */}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-[#0a8098] mb-6">
          {otpSent ? "Verify Your Email" : "Create an Account"}
        </h2>

        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center rounded-md p-3 mb-4"
          >
            {errorMessage}
          </motion.p>
        )}

        {!otpSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* --- Full Name --- */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                aria-label="Full Name"
                {...register("name", { required: "Full Name is required" })}
                className={`${inputStyle} ${errors.name ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-white/20'}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{String(errors.name.message)}</p>}
            </div>

            {/* --- Email --- */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                aria-label="Email Address"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
                })}
                className={`${inputStyle} ${errors.email ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-white/20'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{String(errors.email.message)}</p>}
            </div>

            {/* --- Password --- */}
            <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            aria-label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
              validate: {
                hasSpecialChar: (value) =>
                  /[^A-Za-z0-9]/.test(value) || "Must include 1 special character",
                hasUppercase: (value) =>
                  /[A-Z]/.test(value) || "Must include 1 uppercase letter",
                hasLowercase: (value) =>
                  /[a-z]/.test(value) || "Must include 1 lowercase letter"
              }
            })}
            className={`w-full px-3 py-2 pr-10 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500 ${errors.password ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-white/20'}`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-[#0a8098] dark:hover:text-cyan-300 transition-colors"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{String(errors.password.message)}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            aria-label="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match"
            })}
            className={`w-full px-3 py-2 pr-10 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-white/20'}`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-[#0a8098] dark:hover:text-cyan-300 transition-colors"
            onClick={() => setShowConfirmPassword(prev => !prev)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{String(errors.confirmPassword.message)}</p>
        )}
      </div>

            {/* --- Submit Button --- */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              // *** MODIFICATION: Use isValid from formState ***
              className={`${isValid && !loading ? primaryButtonStyle : disabledButtonStyle} mt-6`}
              disabled={!isValid || loading}
            >
              {loading ? ( /* Loading SVG */ <>...</> ) : "Create Account"}
            </motion.button>
          </form>
        ) : (
          // --- OTP Verification Form ---
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="space-y-5"
           >
             <p className="text-center text-gray-300 text-sm">
               An OTP has been sent to <span className="font-medium text-[#0a8098]">{email}</span>. Please enter it below.
             </p>
             <div>
               <label className="block text-sm font-medium text-gray-300 mb-1">OTP Code</label>
               <input
                 type="text"
                 inputMode="numeric"
                 aria-label="One-Time Password"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                 placeholder="Enter 6-digit OTP"
                 maxLength={6}
                 className={`${inputStyle} text-center tracking-[0.3em]`}
               />
             </div>
             <motion.button
               onClick={handleVerifyOtp}
               whileHover={{ scale: 1.03 }}
               whileTap={{ scale: 0.98 }}
               className={`${!loading ? primaryButtonStyle : disabledButtonStyle} mt-6`}
               disabled={loading || otp.length < 6}
             >
               {loading ? "Verifying..." : "Verify OTP"}
             </motion.button>
             <button
               type="button"
               onClick={handleResendOtp}
               className={secondaryButtonStyle}
               disabled={resendDisabled || loading}
             >
               {resendDisabled ? (
                 // Display the timer countdown
                 `Resend OTP in ${resendTimer}s`
               ) : (
                 "Resend OTP"
               )}
             </button>
           </motion.div>
        )}

        {/* Link to Login */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#0a8098] hover:text-cyan-300 transition">
            Log in
          </Link>
        </p>
      </motion.div>

      {/* Signup Disabled Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Signup Disabled
            </h3>
            <p className="mb-4 text-gray-700">
              We are not taking any new users currently.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}