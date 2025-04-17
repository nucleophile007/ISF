"use client";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSearchParams } from "next/navigation";

type Point = [number, number];

export default function VisualizePage() {
    const searchParams = useSearchParams()
    const filename = searchParams.get("filename");

  const [contourPath, setContourPath] = useState<Point[]>([]);
  const [spiralPath, setSpiralPath] = useState<Point[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!filename || typeof filename !== "string") return;

    const fetchToolpaths = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/get_toolpaths/${filename}`);
        const data = await res.json();

        setContourPath(data.contour || []);
        setSpiralPath(data.spiral || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch toolpaths:", err);
      }
    };

    fetchToolpaths();
  }, [filename]);

  if (loading) return <p className="text-center mt-10">Loading toolpaths...</p>;

  const extractXY = (points: Point[]) => {
    return {
      x: points.map((p) => p[0]),
      y: points.map((p) => p[1]),
    };
  };

  const contourXY = extractXY(contourPath);
  const spiralXY = extractXY(spiralPath);

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-4">Toolpath Visualization</h1>

      <Plot
        data={[
          {
            x: contourXY.x,
            y: contourXY.y,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" },
            name: "Contour Path",
          },
          {
            x: spiralXY.x,
            y: spiralXY.y,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "green" },
            name: "Spiral Path",
          },
        ]}
        layout={{
          width: 800,
          height: 600,
          title: "Contour & Spiral Toolpaths",
          xaxis: { title: "X (mm)" },
          yaxis: { title: "Y (mm)" },
        }}
      />
    </div>
  );
}