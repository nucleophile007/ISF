// 'use client';

// import { useSearchParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function SimulationPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [simUrl, setSimUrl] = useState<string | null>(null);

//   useEffect(() => {
//     const html_path = searchParams.get('html_path');
//     if (html_path) {
//       setSimUrl(`http://127.0.0.1:500${html_path}`);
//     }
//   }, [searchParams]);

//   return (
//     <div className="w-full min-h-screen flex flex-col items-center justify-center p-8">
//       <button
//         onClick={() => router.back()}
//         className="absolute top-4 left-4 px-4 py-2 border border-[#0a8098] text-[#0a8098] bg-white rounded-xl hover:shadow-lg"
//       >
//         ⬅ Back
//       </button>

//       {simUrl ? (
//         <iframe
//           src={simUrl}
//           title="Simulation"
//           className="w-full max-w-5xl h-[600px] border rounded-xl shadow-xl"
//         />
//       ) : (
//         <p>Loading simulation...</p>
//       )}
//     </div>
//   );
// }
// pages/simulation.tsx
'use client';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/ui/header";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function SimulationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [simUrl, setSimUrl] = useState<string | null>(null);

  useEffect(() => {
    const html_path = searchParams.get("html_path");
    if (html_path) {
      setSimUrl(`${API}${html_path}`);
    }
  }, [searchParams]);

  return (
    <>
      <Header title="Simulation View" />

      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 flex flex-col items-center transition-colors duration-500">
        {/* <h1 className="text-2xl font-bold text-center dark:text-white mt-6 mb-4 animate-fade-in">
          Simulation Result
        </h1> */}

        <button
          onClick={() => router.back()}
          className="self-start px-4 py-2 mb-4 border border-[#0a8098] text-[#0a8098] bg-white dark:bg-gray-700 dark:text-[#0a8098] rounded-xl hover:shadow-lg transition-all"
        >
          ⬅ Back
        </button>

        <div className="w-full max-w-6xl h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 transition-all duration-500 animate-fade-in">
          {simUrl ? (
            <iframe
              src={simUrl}
              title="Simulation"
              className="w-full h-full rounded-xl border-none"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center mt-20">
              Loading simulation...
            </p>
          )}
        </div>

        <footer className="mt-6 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Incremental Forming. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
