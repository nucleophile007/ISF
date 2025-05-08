"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
  const router = useRouter();
  const [signupAllowed, setSignupAllowed] = useState(true);
  const [loginAllowed, setLoginAllowed] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/status`)
      .then((res) => res.json())
      .then((data) => {
        setSignupAllowed(data.signup_allowed);
        setLoginAllowed(data.login_allowed);
      });
  }, []);

  const toggleSignup = async () => {
    const res = await fetch(`${API}/api/admin/toggle-signup`, {
      method: "POST",
    });
    const data = await res.json();
    setSignupAllowed(data.signup_allowed);
  };

  const toggleLogin = async () => {
    const res = await fetch(`${API}/api/admin/toggle-login`, {
      method: "POST",
    });
    const data = await res.json();
    setLoginAllowed(data.login_allowed);
  };

  const goToFeedback = () => router.push("/admin/feedback");
  const goToFiles = () => router.push("/admin/seefile");

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-semibold text-center mb-10 text-gray-800">
          Admin Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <button
            onClick={goToFeedback}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-lg font-medium transition duration-300"
          >
            View Feedback
          </button>

          <button
            onClick={goToFiles}
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-lg font-medium transition duration-300"
          >
            View Uploaded Files
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md flex flex-col items-center">
            <p className="text-xl font-medium mb-4 text-gray-700">
              Signup is currently{" "}
              <span className={signupAllowed ? "text-green-600" : "text-red-600"}>
                {signupAllowed ? "Enabled" : "Disabled"}
              </span>
            </p>
            <button
              onClick={toggleSignup}
              className={`py-2 px-6 rounded-xl font-medium text-white transition duration-300 ${
                signupAllowed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {signupAllowed ? "Disable Signup" : "Enable Signup"}
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md flex flex-col items-center">
            <p className="text-xl font-medium mb-4 text-gray-700">
              Login is currently{" "}
              <span className={loginAllowed ? "text-green-600" : "text-red-600"}>
                {loginAllowed ? "Enabled" : "Disabled"}
              </span>
            </p>
            <button
              onClick={toggleLogin}
              className={`py-2 px-6 rounded-xl font-medium text-white transition duration-300 ${
                loginAllowed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loginAllowed ? "Disable Login" : "Enable Login"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
