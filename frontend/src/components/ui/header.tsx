// "use client";
// import Link from 'next/link';
// import Image from "next/image";
// interface HeaderProps {
//     title: string;
//   }
  
// export default function Header({title}:HeaderProps) {
//   return (
//     <header className="w-full flex justify-between items-center bg-blue-600 dark:bg-blue-800 p-4 text-white shadow-md">
//     <Link href="https://www.iitdh.ac.in/" target="_blank" rel="noopener noreferrer">
//       <Image
//         src="/images/27-dff6c2520e4e6c7c8feb5a3f9ba36b1f-removebg-preview.png"
//         alt="Logo 1"
//         width={80}
//         height={80}
//       />
//       </Link>
//       <h1 className="text-2xl font-bold text-center">
//        {title}
//       </h1>
//       <Link href="https://www.iith.ac.in/" target="_blank" rel="noopener noreferrer">
//       <Image
//         src="/images/IIT_Hyderabad_Insignia.svg.png"
//         alt="Logo 2"
//         width={80}
//         height={80}
//       />
//       </Link>
//     </header>
//   );
// }
"use client";
import Link from 'next/link';
import Image from "next/image";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#0a8098] to-[#0a8c98] dark:from-[#083f4c] dark:to-[#0a5865] shadow-xl rounded-b-2xl">
      
      {/* Left Logo */}
      <Link href="https://www.iitdh.ac.in/" target="_blank" rel="noopener noreferrer">
        <Image
          src="/images/27-dff6c2520e4e6c7c8feb5a3f9ba36b1f-removebg-preview.png"
          alt="IITDH Logo"
          width={70}
          height={70}
          className="hover:scale-105 transition-transform"
        />
      </Link>

      {/* Center Title */}
      <h1 className="text-3xl font-semibold text-white text-center font-[Inter] tracking-wide animate-fade-in">
        {title}
      </h1>

      {/* Right Logo */}
      <Link href="https://www.iith.ac.in/" target="_blank" rel="noopener noreferrer">
        <Image
          src="/images/IIT_Hyderabad_Insignia.svg.png"
          alt="IITH Logo"
          width={70}
          height={70}
          className="hover:scale-105 transition-transform"
        />
      </Link>
    </header>
  );
}
