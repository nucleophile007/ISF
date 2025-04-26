
// // "use client";

// // import React from "react";

// // export default function ToolpathPlot() {
// //   return (
// //     <div className="plot-container w-full flex flex-col items-center gap-6 p-4">
// //       <h2 className="text-xl font-semibold dark:text-white text-center animate-fade-in">
// //         Toolpath Visualizations
// //       </h2>
// //       <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-fade-in">
// //           <iframe
// //             src="http://127.0.0.1:5000/static/pnt.html"
// //             title="Toolpath Plot"
// //             className="w-full h-full border-0"
// //           />
// //         </div>
// //         <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-fade-in">
// //           <iframe
// //             src="http://127.0.0.1:5000/static/spnt.html"
// //             title="Secondary Toolpath Plot"
// //             className="w-full h-full border-0"
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import React from "react";
// import Link from "next/link";

// export default function ToolpathPlot() {
//   return (
//     <div className="plot-container w-full flex flex-col items-center gap-6 p-4">
//       <h2 className="text-xl font-semibold dark:text-white text-center animate-fade-in">
//         Toolpath Visualizations
//       </h2>

//       <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-fade-in">
//           <iframe
//             src="http://127.0.0.1:5000/static/pnt.html"
//             title="Toolpath Plot"
//             className="w-full h-full border-0"
//           />
//         </div>
//         <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-fade-in">
//           <iframe
//             src="http://127.0.0.1:5000/static/spnt.html"
//             title="Secondary Toolpath Plot"
//             className="w-full h-full border-0"
//           />
//         </div>
//       </div>

//       {/* Download Buttons */}
//       <div className="flex flex-wrap justify-center gap-4 mt-6">
//         <a
//           href="http://127.0.0.1:5000/downloadcontour"
//           download="contour.zip"
//           className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             fill="#0a8098"
//             className="transition-transform duration-300 group-hover:translate-y-1"
//             viewBox="0 0 16 16"
//           >
//             <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
//             <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
//           </svg>
//           <span className="text-[#0a8098] font-semibold">Contour</span>
//         </a>

//         <a
//           href="http://127.0.0.1:5000/downloadspiral"
//           download="spiral.zip"
//           className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             fill="#0a8098"
//             className="transition-transform duration-300 group-hover:translate-y-1"
//             viewBox="0 0 16 16"
//           >
//             <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
//             <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
//           </svg>
//           <span className="text-[#0a8098] font-semibold">Spiral</span>
//         </a>
//       </div>

//       {/* Another Button */}
//       <Link href="/home" className="mt-4">
//         <button
//           className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out group"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             fill="#0a8098"
//             className="transition-transform duration-300 group-hover:-translate-x-1"
//             viewBox="0 0 16 16"
//           >
//             <path
//               fillRule="evenodd"
//               d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"
//             />
//           </svg>
//           <span className="text-[#0a8098] font-semibold">Another</span>
//         </button>
//       </Link>
//     </div>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { label } from "framer-motion/client";
import { useRouter } from "next/navigation";
import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function ToolpathPlot() {
  const router = useRouter();
  const handleChange = async (type:string) => {
    const route = type === "contour" ? "simul1" : "simul2";
    const res = await axios.get(`${API}/${route}`);
      const htmlPath = res.data.html_path;
      router.push(`/simulation?html_path=${encodeURIComponent(htmlPath)}`);
  };
  return (
    <>
    <motion.div
  className="plot-container w-full flex flex-col items-center gap-6 p-4"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* Top Buttons Row */}
  <div className="w-full flex justify-between items-center px-4 mb-4">
    {/* Another Button (Left) */}
    <Link href="/home">
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#0a8098"
          className="transition-transform duration-300 group-hover:-translate-x-1"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"
          />
        </svg>
        <span className="text-[#0a8098] font-semibold">Another</span>
      </motion.button>
    </Link>

    {/* Download Buttons (Right) */}
    <div className="flex flex-row gap-4">
      {[
        { label: "Contour", link: "downloadcontour" },
        { label: "Spiral", link: "downloadspiral" },
      ].map(({ label, link }, i) => (
        <motion.a
          key={i}
          href={`${API}/${link}`}
          download={`${label.toLowerCase()}.zip`}
          className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#0a8098"
            className="transition-transform duration-300 group-hover:translate-y-1"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
          </svg>
          <span className="text-[#0a8098] font-semibold">{label}</span>
        </motion.a>
      ))}
    </div>
  </div>

  {/* Iframes with Simulate Buttons */}
  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
    {[{ src: "pont.html",label:"contour" }, { src: "spont.html" ,label:"spiral"}].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.2, duration: 0.5 }}
        className="w-full flex flex-col items-center"
      >
        <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <iframe
            src={`${API}/static/${item.src}`}
            title={`Toolpath Plot ${i + 1}`}
            className="w-full h-full border-0"
          />
        </div>

        {/* Simulate Button */}
        <motion.button
          className="mt-4 group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          onClick={()=>handleChange(item.label)}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#0a8098"
            className="transition-transform duration-300 group-hover:translate-y-1"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
          </svg> */}
          <span className="text-[#0a8098] font-semibold">Simulate</span>
        </motion.button>
      </motion.div>
    ))}
  </div>
</motion.div>
    </>
  );
}
