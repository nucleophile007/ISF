"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  interface User {
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        router.push("/login");
        return;
    }

    console.log("Token before request:", token);  // ✅ Debugging

    axios.get("http://127.0.0.1:5000/api/me", {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true  // ✅ Ensure credentials are included
    })
    .then((res) => {
        console.log("Response data:", res.data);  // ✅ Debugging
        setUser(res.data);
    })
    .catch((err) => {
        console.error("Error fetching user:", err);  // ✅ Log errors
        router.push("/login");
    });
}, []);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
