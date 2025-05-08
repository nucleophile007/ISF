// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// const API = process.env.NEXT_PUBLIC_API_URL;




// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.post(`${API}/api/login`, { email, password });

//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("user_role", res.data.user_role);
//         localStorage.setItem("userEmail", email);

      
//         if (res.data.user_role === "admin") {
//           router.push("/choose-role");
//         } else {
//           router.push("/home");
//         }
//       }
//     } catch (err) {
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6"
//       >
//         <h2 className="text-3xl font-semibold text-center text-gray-800">Welcome Back</h2>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <div className="space-y-2">
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="you@example.com"
//           />
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="••••••••"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
//           disabled={loading}
//         >
//           {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"}
//         </button>

//         <div className="flex flex-col gap-2 text-center text-sm text-gray-600 mt-4">
//           <a href="/forgot_password" className="text-blue-600 hover:underline">
//             Forgot Password?
//           </a>
//           <span>
//             Don't have an account?{" "}
//             <a href="/signup" className="text-blue-600 hover:underline">
//               Sign up
//             </a>
//           </span>
//         </div>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from "framer-motion"; // Import motion

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await axios.post(`${API}/api/login`, { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_role", res.data.user_role);
        localStorage.setItem("userEmail", email);

        if (res.data.user_role === "admin") {
          router.push("/choose-role");
        } else {
          router.push("/home");
        }
      } else {
         // Handle cases where the API might not return a token
         setError(res.data.message || "Login failed. Please check credentials.");
      }
    } catch (err: any) {
       // Handle different kinds of errors
      if (axios.isAxiosError(err) && err.response) {
        // Use error message from backend if available, otherwise provide a generic one
        setError(err.response.data.message || "Invalid email or password.");
      } else {
        setError("An network or server error occurred. Please try again.");
        console.error("Login error:", err); // Log unexpected errors
      }
    } finally {
      setLoading(false);
    }
  };

  // Simple handler to update password state (validation removed as per input)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
     // Optionally clear the main error when user types in password field
     if (error) {
        setError("");
     }
  };

   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
     // Optionally clear the main error when user types in email field
     if (error) {
        setError("");
     }
  };


  return (
    // Outer container with background and centering
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 px-4">
       {/* Animated container for the form */}
       <motion.div
         className="w-full max-w-sm"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
       >
        <form
          onSubmit={handleLogin}
          // Glassmorphism style
          className="w-full bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg shadow-xl border border-white/20 dark:border-gray-700/50 rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-semibold text-center text-[#0a8098] dark:text-cyan-300">
            Welcome Back
          </h2>

           {/* Central Error Display */}
          {error && (
            <motion.p
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              className="text-red-500 dark:text-red-400 text-sm text-center -mb-2" // Added negative margin bottom to reduce space if error present
            >
              {error}
            </motion.p>
          )}

          {/* Email Input Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={handleEmailChange} // Use handler
              // Updated input styling
              className="w-full px-4 py-2 bg-white/20 dark:bg-gray-700/30 border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a8098]/50 dark:focus:ring-cyan-400/60 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'} // Correctly use state here
                required
                value={password}
                onChange={handlePasswordChange} // Use handler
                // Updated input styling
                className="w-full px-4 py-2 bg-white/20 dark:bg-gray-700/30 border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a8098]/50 dark:focus:ring-cyan-400/60 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 pr-10" // Added pr-10 for icon space
                placeholder="••••••••"
              />
              {/* Password visibility toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-[#0a8098] dark:hover:text-cyan-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
             {/* Removed the duplicate error message previously here */}
          </div>

          {/* Submit Button - Styled like ToolpathPlot buttons */}
          <motion.button
            type="submit"
            // Apply button styles from ToolpathPlot
            className="group w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 dark:border-gray-700/50 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading || !email || !password} // Disable if loading or fields are empty
            whileHover={{ scale: !loading ? 1.05 : 1 }} // Add hover animation only if not loading
            whileTap={{ scale: !loading ? 0.98 : 1 }}   // Add tap animation only if not loading
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-[#0a8098] dark:text-cyan-300" />
            ) : (
              <span className="text-[#0a8098] dark:text-cyan-300 font-semibold">Login</span>
            )}
          </motion.button>

          {/* Links */}
          <div className="flex flex-col gap-3 text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            <a href="/forgot_password" className="text-[#0a8098] dark:text-cyan-400 hover:underline">
              Forgot Password?
            </a>
            <span>
              Don't have an account?{" "}
              <a href="/signup" className="text-[#0a8098] dark:text-cyan-400 font-semibold hover:underline">
                Sign up
              </a>
            </span>
          </div>
        </form>
       </motion.div>
    </div>
  );
}

