"use client";
import { useState } from "react";

export default function Footer() {
  const [feedbackText, setFeedbackText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const API = process.env.NEXT_PUBLIC_API_URL;
  const handleLogout = () => {
    // Replace with your logout logic (e.g., clearing tokens, redirecting)
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ feedback_text: feedbackText }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Feedback submitted!");
        setFeedbackText("");
        setShowModal(false);
      } else {
        setMessage(`❌ ${data.error || "Submission failed"}`);
      }
    } catch (err) {
      setMessage("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <footer className="w-full px-6 py-4 bg-gradient-to-r from-[#0a8098] to-[#0a8c98] dark:from-[#083f4c] dark:to-[#0a5865] text-white flex justify-between items-center rounded-t-2xl shadow-xl mt-6">
      
      <p className="text-sm font-light">© 2025 Incremental Forming. All rights reserved.</p>

      <div className="flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-[#0a8098] px-4 py-2 rounded-xl shadow hover:bg-gray-200 transition"
        >
          Feedback
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Submit Feedback</h2>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-3"
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Your feedback..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#0a8098] text-white rounded hover:bg-[#08788c]"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {message && <p className="mt-3 text-sm">{message}</p>}
          </div>
        </div>
      )}
    </footer>
  );
}
