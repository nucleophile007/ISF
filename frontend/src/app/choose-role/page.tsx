"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChooseRolePage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "admin") {
      router.push("/home"); // unauthorized access fallback
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
      <h1 className="text-2xl font-semibold">Where do you want to go?</h1>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/home")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Home Page
        </button>
        <button
          onClick={() => router.push("/admin")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Admin Page
        </button>
      </div>
    </div>
  );
}
