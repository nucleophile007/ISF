"use client";
import Link from 'next/link';
import Image from "next/image";
interface HeaderProps {
    title: string;
  }
  
export default function Header({title}:HeaderProps) {
  return (
    <header className="w-full flex justify-between items-center bg-blue-600 dark:bg-blue-800 p-4 text-white shadow-md">
    <Link href="https://www.iitdh.ac.in/" target="_blank" rel="noopener noreferrer">
      <Image
        src="/images/27-dff6c2520e4e6c7c8feb5a3f9ba36b1f-removebg-preview.png"
        alt="Logo 1"
        width={80}
        height={80}
      />
      </Link>
      <h1 className="text-2xl font-bold text-center">
       {title}
      </h1>
      <Link href="https://www.iith.ac.in/" target="_blank" rel="noopener noreferrer">
      <Image
        src="/images/IIT_Hyderabad_Insignia.svg.png"
        alt="Logo 2"
        width={80}
        height={80}
      />
      </Link>
    </header>
  );
}