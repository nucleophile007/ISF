'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 text-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-opacity-90 bg-blue-900 shadow-md fixed top-0 w-full z-50 backdrop-blur-lg">
        <Image src="/images/27-dff6c2520e4e6c7c8feb5a3f9ba36b1f-removebg-preview.png" alt="Logo 1" width={80} height={80} className="drop-shadow-lg" />
        <Image src="/images/IIT_Hyderabad_Insignia.svg.png" alt="Logo 2" width={80} height={80} className="drop-shadow-lg" />
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between max-w-6xl p-10 bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <motion.div className="md:w-1/2 text-left"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}>
            <h1 className="text-6xl font-extrabold tracking-wide leading-tight text-white drop-shadow-2xl">Toolpath Generation for Incremental Sheet Forming</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Generate precise toolpaths (contour and spiral) for the Single Point Incremental Forming process using CAD models with a .STEP extension. View your 3D model and simulate the path generation effortlessly.
            </p>
            <Link href="/login">
              <motion.button 
                className="mt-8 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full shadow-xl hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 ease-in-out transform hover:scale-110"
                whileHover={{ scale: 1.1 }}>
                Get Started
              </motion.button>
            </Link>
          </motion.div>
          <motion.div className="md:w-1/2 flex justify-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}>
            <Image src="/images/Designer1.jpeg" alt="Incremental Forming Process" width={500} height={450} className="rounded-3xl shadow-2xl" />
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-300">Meet the Team</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-6">
          {[{
            name: "Pranu Pranjal",
            role: "Undergrad, Mechanical Engineering at NIT AP"
          }, {
            name: "Dr. Rakesh Lingam",
            role: "Assistant Professor, Mechanical, Materials & Aerospace Engineering, IIT Dharwad"
          }, {
            name: "Dr. Venkata Reddy N",
            role: "Professor, Mechanical & Aerospace Engineering, IIT Hyderabad"
          }].map((member, index) => (
            <motion.div key={index} 
              className="bg-gray-800 p-6 rounded-xl shadow-xl w-80 transition-transform transform hover:scale-110 backdrop-blur-md bg-opacity-50"
              whileHover={{ scale: 1.05 }}>
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="text-gray-300">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </footer>
    </div>
  );
}
