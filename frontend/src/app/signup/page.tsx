"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  
  const startResendTimer = () => {
    setResendDisabled(true);
    setTimeout(() => setResendDisabled(false), 30000);
  };

  // Handle Signup
  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage("");
    setEmail(data.email);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.data.success) {
        setOtpSent(true);
        startResendTimer();
      } else {
        setErrorMessage(response.data.message || "Signup failed. Try again.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/verify-otp", { email, otp });

      if (response.data.success) {
        router.push("/login");
      } else {
        setErrorMessage("Invalid OTP. Try again.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/resend-otp", { email });

      if (!response.data.success) {
        setErrorMessage(response.data.message);
      } else {
        startResendTimer();
      }
    } catch (error: any) {
      setErrorMessage("Failed to resend OTP. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {otpSent ? "Verify OTP" : "Create an Account"}
        </h2>

        {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}

        {!otpSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <input type="text" {...register("name", { required: "Name is required" })}
                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
              {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input type="email" {...register("email", { required: "Email is required" })}
                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
              {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input type="password" {...register("password", { required: "Password is required", minLength: 6 })}
                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
              {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                   placeholder="Enter OTP"
                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
            <button onClick={handleVerifyOtp} className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4">
              Verify OTP
            </button>
            <button onClick={handleResendOtp} className="w-full text-blue-500 mt-2"
                    disabled={resendDisabled}>
              {resendDisabled ? "Resend in 30s" : "Resend OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
