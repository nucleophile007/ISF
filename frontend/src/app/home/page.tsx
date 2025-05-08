"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useCNCStore } from "@/store/useCNCStore";
const API = process.env.NEXT_PUBLIC_API_URL;


export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedSTL, setConvertedSTL] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    incremental_depth: "",
    tool_dia: "",
    feedrate: "",
    cnc: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    axios
      .get(`${API}//api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (file) {
      console.log("Updated file state:", file);
    }
  }, [file]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log(selectedFile)
      setFile(selectedFile);
      console.log(file)
      const filename = selectedFile.name.toLowerCase();
      if (!user || !user.email) {
        setError("User information missing.");
        setLoading(false);
        return;
      }

      if (filename.endsWith(".step") || filename.endsWith(".stp")) {
        const data = new FormData();
        data.append("file", selectedFile);
        console.log("Selected file:", selectedFile);
        data.append("email", user.email);

        try {
          const res = await axios.post(`${API}/upload`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // const stlUrl = res.data.stl_url;
          // console.log("STL auto-converted from STEP:", stlUrl);
          // loadSTLFile(stlUrl);
          const stlUrl = `${API}/converted/${res.data.stl_url}`;
          console.log("STL auto-converted from STEP:", stlUrl);
          setConvertedSTL(stlUrl); // ✅ store the STL for later use
          loadSTLFile(stlUrl);
        } catch (err) {
          console.error("Auto-conversion error:", err);
          alert("Failed to convert STEP file.");
        }
      } else if (filename.endsWith(".stl")) {
        const fileURL = URL.createObjectURL(selectedFile);
        loadSTLFile(fileURL);
      } else {
        alert("Unsupported file type. Please upload a .step, .stp, or .stl file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function LoadingOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showMessage, setShowMessage] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => setShowMessage(true), 3000);
  
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
      camera.position.set(0, 0, 15);
  
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setSize(400, 400);
      renderer.setPixelRatio(window.devicePixelRatio);
  
      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(10, 10, 20);
      scene.add(light);
  
      // Sheet
      const geometry = new THREE.PlaneGeometry(6, 6, 60, 60);
      const material = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        side: THREE.DoubleSide,
        wireframe: true,
      });
      const sheet = new THREE.Mesh(geometry, material);
      scene.add(sheet);
  
      // Tool
      const tool = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x0a8098 })
      );
      scene.add(tool);
  
      // Shaft
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
      );
      shaft.rotation.x = Math.PI / 2;
      scene.add(shaft);
  
      let t = 0;
      function animate() {
        requestAnimationFrame(animate);
        t += 0.02;
  
        const x = Math.sin(t) * 1.5;
        const y = Math.cos(t) * 1.5;
        const z = -Math.abs(Math.sin(t * 2)) * 1;
  
        tool.position.set(x, y, z);
        shaft.position.set(x, y, z + 4);
        shaft.scale.z = 1;
  
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const px = pos.getX(i);
          const py = pos.getY(i);
          const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
          const influence = Math.exp(-distance * 3);
          pos.setZ(i, -influence * Math.abs(z) * 1.5);
        }
        pos.needsUpdate = true;
  
        renderer.render(scene, camera);
      }
  
      animate();
  
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 dark:bg-black/30 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Forming in progress...
        </div>
  
        <canvas ref={canvasRef} style={{ width: 400, height: 400 }} />
  
        {showMessage && (
          <div className="text-md mt-4 text-gray-600 dark:text-gray-300 animate-pulse">
            Keep patience — precision takes time.
          </div>
        )}
      </div>
    );
  }
  
  
  
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    if (!file || !convertedSTL) {
      setError("Please select a file first.");
      setLoading(false);
      return;
    }
  
    if (!user || !user.email) {
      setError("User information missing.");
      setLoading(false);
      return;
    }
  
    const data = new FormData();
    data.append("file", file);
    data.append("incremental_depth", formData.incremental_depth);
    data.append("tool_dia", formData.tool_dia);
    data.append("feedrate", formData.feedrate);
    data.append("cnc", formData.cnc);
    data.append("email", user.email);
  
    try {
      const res = await axios.post(`${API}/upload2`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const result = res.data as { contour_folder?: string; spiral_folder?: string };
  
      if (result.contour_folder && result.spiral_folder) {
        useCNCStore.getState().setFolders(result.contour_folder, result.spiral_folder);
      }
  
      const emailSanitized = user.email.replace(/[^a-zA-Z0-9]/g, "_");
      router.push("/view");
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload or convert file.");
    } finally {
      setLoading(false);
    }
  };
  
  const loadSTLFile = (fileURL: string) => {
    if (!viewerRef.current) return;

    while (viewerRef.current.firstChild) {
      viewerRef.current.removeChild(viewerRef.current.firstChild);
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(75, viewerRef.current.clientWidth / viewerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
    viewerRef.current.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const loader = new STLLoader();
    loader.load(
      fileURL,
      (geometry) => {
        const material = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 100 , side: THREE.DoubleSide,});
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const bbox = new THREE.Box3().setFromObject(mesh);
        const center = bbox.getCenter(new THREE.Vector3());
        mesh.position.sub(center);

        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.set(0, 0, cameraZ*2);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        animate();
      },
      undefined,
      (err) => {
        console.error("Failed to load STL file:", err);
      }
    );
  };

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-xl dark:text-white">Loading...</div>;
  }

  return (
    <>
        {loading && <LoadingOverlay />} 
    <Header title="Toolpath for Incremental Sheet Forming"/>
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center p-6 transition-colors duration-500">
      <h2 className="text-xl font-semibold mt-4 text-center dark:text-white animate-fade-in">Welcome, {user.name}!</h2>
      <form onSubmit={handleSubmit}>
      <Card className="bg-white dark:bg-gray-900 mt-6 w-full max-w-lg shadow-xl">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold dark:text-white">Upload Your File</h2>
          <Input type="file" accept=".step,.stp,.stl" onChange={(e) => { handleFileChange(e); handleChange(e); }} required />
          <Input type="number" name="incremental_depth" step="0.1" value={formData.incremental_depth} onChange={handleChange} placeholder="Incremental Depth (mm)" required />
          <Input type="number" name="tool_dia" value={formData.tool_dia} onChange={handleChange} placeholder="Tool Diameter (mm)" required />
          <Input type="number" name="feedrate" step="10" value={formData.feedrate} onChange={handleChange} placeholder="Feedrate (mm/min)" required />
            <div>
            <p className="dark:text-white font-medium mb-2">Select CNC Machine</p>
            <div className="flex items-center gap-6 mt-2">
              {["Fanuc", "Siemens"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                <div className="relative w-4 h-4">
                  <input
                    type="radio"
                    name="cnc"
                    value={option}
                    checked={formData.cnc === option}
                    onChange={handleChange}
                    className="appearance-none w-4 h-4 border-2 border-[#0a8098] rounded-full checked:border-5 checked:border-[#0a8098] transition-all duration-200"
                  />
                </div>
                <span className="text-sm text-gray-800 dark:text-white font-medium pt-1">
                  {option}
                </span>
              </label>
              ))}
            </div>
          </div>
          <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md shadow-lg border border-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#0a8098"
                className="transition-transform duration-300 group-hover:-translate-y-1"
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M8.354 4.146a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V14.5a.5.5 0 0 0 1 0V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3z" />
              </svg>
              <span className="text-[white] font-semibold">Upload</span>
            </button>
        </CardContent>
      </Card>
      </form>
      <div className="w-full mt-6 flex justify-center items-center">
  <div
    ref={viewerRef}
    className="w-full max-w-[1200px] h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-500 animate-fade-in"
  />
</div>

        <Footer />
      
    </div>
    </>
  );
}