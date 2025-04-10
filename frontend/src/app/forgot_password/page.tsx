"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to send reset email.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 mt-4 rounded">
          Send Reset Link
        </button>
        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
}
