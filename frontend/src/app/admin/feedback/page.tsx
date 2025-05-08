"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
const API=process.env.NEXT_PUBLIC_API_URL;

interface Feedback {
  id: number;
  user_name: string;
  user_email: string;
  feedback_text: string;
  created_at: string;
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    fetchFeedback(1);
  }, []);

  const fetchFeedback = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/feedback?page=${page}&limit=${limit}`);
      setFeedback(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching feedback", err);
    }
    setLoading(false);
  };

  const handlePrev = () => {
    const newPage = Math.max(page - 1, 1);
    setPage(newPage);
    fetchFeedback(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(page + 1, totalPages);
    setPage(newPage);
    fetchFeedback(newPage);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Feedback</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border border-gray-200 mb-4 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Feedback</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((fb) => (
                <tr key={fb.id}>
                  <td className="p-2 border">{fb.id}</td>
                  <td className="p-2 border">{fb.user_name}</td>
                  <td className="p-2 border">{fb.user_email}</td>
                  <td className="p-2 border">{fb.feedback_text}</td>
                  <td className="p-2 border">{new Date(fb.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-4">
            <button
              disabled={page === 1}
              onClick={handlePrev}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={handleNext}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
