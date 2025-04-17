
"use client";

import React from "react";

export default function ToolpathPlot() {
  return (
    <div className="plot-container w-full flex flex-col items-center gap-6 p-4">
      <h2 className="text-xl font-semibold dark:text-white text-center animate-fade-in">
        Toolpath Visualizations
      </h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-fade-in">
          <iframe
            src="http://127.0.0.1:5000/static/pnt.html"
            title="Toolpath Plot"
            className="w-full h-full border-0"
          />
        </div>
        <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-fade-in">
          <iframe
            src="http://127.0.0.1:5000/static/spnt.html"
            title="Secondary Toolpath Plot"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
