"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or expired reset link.");
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/api/reset-password", { token, new_password: newPassword });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleReset} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 mt-4 rounded">
          Reset Password
        </button>
        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
}
