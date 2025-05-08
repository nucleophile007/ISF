// 'use client';

// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// const sections = ['home', 'about', 'services', 'contact'];

// export default function Navbar() {
//   const [active, setActive] = useState('home');

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollY = window.scrollY + 130;

//       for (const id of sections) {
//         const section = document.getElementById(id);
//         if (section && scrollY >= section.offsetTop) {
//           setActive(id);
//         }
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <nav className="fixed top-0 left-0 w-full flex justify-center bg-black/30 backdrop-blur-md py-4 z-50 space-x-8">
//       {sections.map((id) => (
//         <a
//           key={id}
//           href={`#${id}`}
//           className={`relative text-lg px-4 py-2 text-gray-300 transition-all duration-300 ease-in-out ${
//             active === id ? 'text-cyan-400' : ''
//           }`}
//         >
//           {id.charAt(0).toUpperCase() + id.slice(1)}
//           <span
//             className={`absolute left-0 bottom-0 w-full h-0.5 bg-cyan-400 rounded transition-all duration-300 ease-in-out transform ${
//               active === id ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-2'
//             }`}
//           ></span>
//         </a>
//       ))}
//     </nav>
//   );
// }
'use client';

import { useEffect, useState } from 'react';

const sections = ['home', 'about', 'documentation', 'contact'];

export default function Navbar() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 130;
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && scrollY >= section.offsetTop) {
          setActive(id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center gap-10 py-5 bg-black/30 backdrop-blur-md">
      {sections.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className={`relative text-xl font-semibold text-cyan-300 px-6 py-2 group`}
        >
          {id.charAt(0).toUpperCase() + id.slice(1)}
          <span
            className={`
              absolute left-0 bottom-0 w-full h-1.5
              bg-cyan-400 rounded-b-full
              transition-all duration-500 ease-in-out
              group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-1
              ${active === id ? 'opacity-100 scale-100 translate-y-1' : 'opacity-0 scale-0 translate-y-4'}
              shadow-[0_0_10px_2px_rgba(0,255,255,0.6)]
            `}
          />
        </a>
      ))}
    </nav>
  );
}
