import ToolpathPlot from "@/components/ui/ToolpathPlot";
import Header from "@/components/ui/header";

export default function ViewPage() {
  return (
    <>
      <Header title="View Generated Toolpath" />
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 flex flex-col items-center transition-colors duration-500">
        <h1 className="text-2xl font-bold text-center dark:text-white mt-6 mb-4 animate-fade-in">
          Generated Toolpath
        </h1>

        <div className="w-full max-w-6xl h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 transition-all duration-500 animate-fade-in">
          <ToolpathPlot />
        </div>

        <footer className="mt-6 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Incremental Forming. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
