// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import Header from '@/components/ui/header';
// import Navbar from '@/components/ui/navbar';
// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 text-gray-100">
//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <main id="home" className="flex flex-col items-center justify-center min-h-screen px-6 pt-32 text-center">
//         <motion.div 
//           className="flex flex-col md:flex-row items-center justify-between max-w-6xl p-10 bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl backdrop-blur-xl"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}>
//           <motion.div className="md:w-1/2 text-left"
//             initial={{ x: -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}>
//             <h1 className="text-6xl font-extrabold tracking-wide leading-tight text-white drop-shadow-2xl">Toolpath Generation for Incremental Sheet Forming</h1>
//             <p className="mt-6 text-lg leading-relaxed text-gray-300">
//               Generate precise toolpaths (contour and spiral) for the Single Point Incremental Forming process using CAD models with a .STEP extension.
//             </p>
//             <Link href="/login">
//               <motion.button 
//                 className="mt-8 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full shadow-xl cursor-pointer hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 ease-in-out transform hover:scale-110"
//                 whileHover={{ scale: 1.05 }}>
//                 Get Started
//               </motion.button>
//             </Link>
//           </motion.div>
//           <motion.div className="md:w-1/2 flex justify-center"
//             initial={{ x: 50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}>
//             <Image src="/images/Designer1.jpeg" alt="Incremental Forming Process" width={500} height={450} className="rounded-3xl shadow-2xl" />
//           </motion.div>
//         </motion.div>
//       </main>

//       {/* About Section */}
//       <section id="about" className="h-screen flex items-center justify-center text-4xl">About Section</section>

//       {/* Services Section */}
//       <section id="services" className="h-screen flex items-center justify-center text-4xl">Services Section</section>

//       {/* Contact Section */}
//       <section id="contact" className="h-screen flex items-center justify-center text-4xl">Contact Section</section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12 text-center">
//         <h2 className="text-2xl font-semibold text-gray-300">Meet the Team</h2>
//         <div className="flex flex-wrap justify-center gap-8 mt-6">
//           {[{
//             name: "Pranu Pranjal",
//             role: "Undergrad, Mechanical Engineering at NIT AP"
//           }, {
//             name: "Dr. Rakesh Lingam",
//             role: "Assistant Professor, Mechanical, Materials & Aerospace Engineering, IIT Dharwad"
//           }, {
//             name: "Dr. Venkata Reddy N",
//             role: "Professor, Mechanical & Aerospace Engineering, IIT Hyderabad"
//           }].map((member, index) => (
//             <motion.div key={index} 
//               className="bg-gray-800 p-6 rounded-xl shadow-xl w-80 transition-transform transform hover:scale-110 backdrop-blur-md bg-opacity-50"
//               whileHover={{ scale: 1.05 }}>
//               <h3 className="text-xl font-bold text-white">{member.name}</h3>
//               <p className="text-gray-300">{member.role}</p>
//             </motion.div>
//           ))}
//         </div>
//       </footer>
//     </div>
//   );
// }
// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import Navbar from '@/components/ui/navbar';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-700 via-indigo-900 to-gray-950 text-gray-100">
//       <Navbar />

//       {/* Hero Section */}
//       <main id="home" className="flex flex-col items-center justify-center min-h-screen px-6 pt-28 text-center">
//         <motion.div
//           className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl p-10 bg-white/5 rounded-3xl shadow-xl backdrop-blur-lg border border-white/10"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <motion.div
//             className="md:w-1/2 text-left space-y-6"
//             initial={{ x: -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
//               Intelligent Toolpath Generation
//             </h1>
//             <p className="text-lg text-gray-300">
//               Upload your CAD models (.STEP) and automatically generate spiral or contour toolpaths for Single Point Incremental Forming.
//             </p>
//             <Link href="/login">
//               <motion.button
//                 className="mt-4 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg hover:from-indigo-400 hover:to-blue-400 transition-all transform hover:scale-105"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 Get Started
//               </motion.button>
//             </Link>
//           </motion.div>

//           <motion.div
//             className="md:w-1/2 flex justify-center mt-10 md:mt-0"
//             initial={{ x: 50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//           >
//             <Image
//               src="/images/Designer1.jpeg"
//               alt="Incremental Forming Process"
//               width={480}
//               height={420}
//               className="rounded-2xl shadow-2xl"
//             />
//           </motion.div>
//         </motion.div>
//       </main>

//       {/* About Section */}
//       <section
//         id="about"
//         className="py-28 px-8 text-center bg-gradient-to-b from-indigo-900 to-gray-950"
//       >
//         <motion.div
//           className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-10 shadow-xl backdrop-blur-lg border border-white/10"
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-4xl font-bold mb-6 text-white">About the Project</h2>
//           <p className="text-lg text-gray-300">
//             Our project focuses on leveraging computational geometry and process automation to generate efficient toolpaths for the Incremental Sheet Forming (ISF) process. The tool supports both contour and spiral trajectories to suit different forming strategies.
//           </p>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section
//         id="services"
//         className="py-28 px-8 text-center bg-gray-950"
//       >
//         <h2 className="text-4xl font-bold mb-10 text-white">Features</h2>
//         <div className="flex flex-wrap justify-center gap-10">
//           {[
//             'Spiral and Contour Toolpath Generation',
//             'STEP File Upload and Processing',
//             'Automated G-Code Ready Output',
//             'Fast Backend Computation with Python/Flask',
//           ].map((feature, index) => (
//             <motion.div
//               key={index}
//               className="bg-white/5 text-gray-200 p-6 rounded-2xl w-72 shadow-md backdrop-blur-md border border-white/10 hover:shadow-xl"
//               whileHover={{ scale: 1.05 }}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: index * 0.1 }}
//               viewport={{ once: true }}
//             >
//               <p className="text-lg font-medium">{feature}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section
//         id="contact"
//         className="py-28 px-8 text-center bg-gradient-to-b from-gray-950 to-black"
//       >
//         <motion.div
//           className="max-w-3xl mx-auto bg-white/5 rounded-3xl p-10 shadow-xl backdrop-blur-lg border border-white/10"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-4xl font-bold mb-6 text-white">Contact Us</h2>
//           <p className="text-lg text-gray-300">
//             For feedback, contributions, or academic collaboration, please reach out to our team. We're excited to improve and evolve this platform together.
//           </p>
//         </motion.div>
//       </section>

//       {/* Footer Section */}
//       <footer className="bg-black text-white py-20 px-6">
//         <h2 className="text-2xl font-semibold text-gray-300 text-center mb-12">Meet the Team</h2>
//         <div className="flex flex-wrap justify-center gap-10">
//           {[
//             {
//               name: 'Pranu Pranjal',
//               role: 'Undergrad, Mechanical Engineering at NIT AP',
//             },
//             {
//               name: 'Dr. Rakesh Lingam',
//               role: 'Assistant Professor, Mechanical, Materials & Aerospace Engineering, IIT Dharwad',
//             },
//             {
//               name: 'Dr. Venkata Reddy N',
//               role: 'Professor, Mechanical & Aerospace Engineering, IIT Hyderabad',
//             },
//           ].map((member, index) => (
//             <motion.div
//               key={index}
//               className="bg-white/5 p-6 rounded-2xl shadow-md w-80 border border-white/10 backdrop-blur-md hover:shadow-xl"
//               whileHover={{ scale: 1.05 }}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: index * 0.15 }}
//               viewport={{ once: true }}
//             >
//               <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
//               <p className="text-gray-300">{member.role}</p>
//             </motion.div>
//           ))}
//         </div>
//       </footer>
//     </div>
//   );
// }
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-indigo-900 to-gray-950 text-gray-100">
      <Navbar />

      {/* Hero Section */}
      <main id="home" className="flex flex-col items-center justify-center min-h-screen px-6 pt-28 text-center">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl p-10 bg-white/5 rounded-3xl shadow-xl backdrop-blur-lg border border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="md:w-1/2 text-left space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
              Incremental Forming
            </h1>
            <p className="text-lg text-gray-300">
              Upload your CAD models (.STEP) and automatically generate spiral or contour toolpaths for Single Point Incremental Forming.
            </p>
            <Link href="/login">
              <motion.button
                className="mt-4 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg hover:from-indigo-400 hover:to-blue-400 transition-all transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="md:w-1/2 flex justify-center mt-10 md:mt-0"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/Designer1.jpeg"
              alt="Incremental Forming Process"
              width={480}
              height={420}
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </main>

      {/* About Section */}
      {/* <section
        id="about"
        className="py-28 px-8 text-center bg-gradient-to-b from-indigo-900 to-gray-950"
      >
        <motion.div
          className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-10 shadow-xl backdrop-blur-lg border border-white/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">About the Project</h2>
          <p className="text-lg text-gray-300">
            Our project focuses on leveraging computational geometry and process automation to generate efficient toolpaths for the Incremental Sheet Forming (ISF) process. The tool supports both contour and spiral trajectories to suit different forming strategies.
          </p>
        </motion.div>
      </section> */}

<section
  id="about"
  className="py-28 px-8 text-center bg-gradient-to-b from-indigo-900 to-gray-950"
>
  <motion.div
    className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-10 shadow-xl backdrop-blur-lg border border-white/10"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    viewport={{ once: true }}
  >
    <h2 className="text-4xl font-bold mb-6 text-white">About the Project</h2>
    <p className="text-lg text-gray-300 leading-relaxed">
      The <span className="text-white font-semibold">ISF Slicer Tool</span> is a comprehensive software solution designed to automate toolpath generation for 
      <span className="text-white font-semibold"> Incremental Sheet Forming (ISF)</span>, a flexible and die-less manufacturing technique. 
      The documentation presents an end-to-end framework for generating toolpaths based on 
      <span className="text-white font-semibold"> 3D solid models in STEP format</span>. Leveraging the capabilities of 
      <span className="text-white font-semibold"> OpenCASCADE</span>, the software extracts geometric features from the CAD model, performs strategic slicing, and calculates both 
      <span className="text-white font-semibold"> contour-based </span> and 
      <span className="text-white font-semibold"> spiral-based trajectories</span>, tailored for 
      <span className="text-white font-semibold"> SPIF applications</span>.
      <br /><br />
      A notable feature of the tool is its built-in 
      <span className="text-white font-semibold"> tool radius compensation</span>, which ensures that the generated paths maintain dimensional fidelity by adjusting for the physical shape of the forming tool. 
      The software also includes 
      <span className="text-white font-semibold"> vector-based normal calculations</span> to guide tool orientation throughout the forming process. 
      Upon processing, it outputs 
      <span className="text-white font-semibold"> G-code compatible with Fanuc and Siemens controllers</span>, and supports user-defined parameters such as 
      <span className="text-white font-semibold"> step depth, feed rate, </span> and 
      <span className="text-white font-semibold"> spindle speed</span>.
      <br /><br />
      To enhance usability, the platform integrates 
      <span className="text-white font-semibold"> 3D visualization tools using Plotly</span>, allowing users to preview and validate the toolpaths before execution. 
      A modern 
      <span className="text-white font-semibold"> Flask-based web interface </span> facilitates 
      <span className="text-white font-semibold"> STEP file upload, simulation, </span> and 
      <span className="text-white font-semibold"> parameter configuration</span>. 
      The system also includes 
      <span className="text-white font-semibold"> user account management, real-time feedback, </span> and 
      <span className="text-white font-semibold"> robust error handling</span> to support streamlined workflow and continuous improvement.
    </p>
  </motion.div>
</section>


{/* Documentation PDF Viewer Section */}
<section
  id="documentation"
  className="py-28 px-8 text-center bg-gray-950"
>
  <h2 className="text-4xl font-bold mb-10 text-white">Documentation</h2>
  <div className="flex justify-center">
    <div className="w-full max-w-4xl h-[800px] rounded-2xl overflow-hidden shadow-lg border border-white/10 backdrop-blur-md">
      <iframe
        src="/documentation.pdf"
        className="w-full h-full"
        frameBorder="0"
        title="ISF Slicer Documentation"
      ></iframe>
    </div>
  </div>
</section>


      {/* Contact Section */}
      <section
        id="contact"
        className="py-28 px-8 text-center bg-gradient-to-b from-gray-950 to-black"
      >
        <motion.div
          className="max-w-3xl mx-auto bg-white/5 rounded-3xl p-10 shadow-xl backdrop-blur-lg border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">Contact Us</h2>
          <p className="text-lg text-gray-300">
            For feedback, contributions, or academic collaboration, please reach out to our team. We're excited to improve and evolve this platform together.
          </p>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white py-20 px-6">
        <h2 className="text-2xl font-semibold text-gray-300 text-center mb-12">Meet the Team</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {[
            {
              name: 'Pranu Pranjal',
              role: 'Undergrad, Mechanical Engineering at NIT AP',
            },
            {
              name: 'Dr. Rakesh Lingam',
              role: 'Assistant Professor, Mechanical, Materials & Aerospace Engineering, IIT Dharwad',
            },
            {
              name: 'Dr. Venkata Reddy N',
              role: 'Professor, Mechanical & Aerospace Engineering, IIT Hyderabad',
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-6 rounded-2xl shadow-md w-80 border border-white/10 backdrop-blur-md hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-gray-300">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </footer>
    </div>
  );
}