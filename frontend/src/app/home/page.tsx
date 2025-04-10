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

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    incremental_depth: "",
    tool_dia: "",
    feedrate: "",
    cnc: "",
  });
  const [user, setUser] = useState<{ name: string } | null>(null);
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
      .get("http://127.0.0.1:5000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const filename = selectedFile.name.toLowerCase();

      if (filename.endsWith(".step") || filename.endsWith(".stp")) {
        const data = new FormData();
        data.append("file", selectedFile);

        try {
          const res = await axios.post("http://127.0.0.1:5000/upload", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const stlUrl = res.data.stl_url;
          console.log("STL auto-converted from STEP:", stlUrl);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first.");

    const data = new FormData();
    data.append("file", file);
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful:", res.data);
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload or convert file.");
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
        const material = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 100 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const bbox = new THREE.Box3().setFromObject(mesh);
        const center = bbox.getCenter(new THREE.Vector3());
        mesh.position.sub(center);

        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.set(0, 0, cameraZ);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center p-6 transition-colors duration-500">
      <header className="w-full flex justify-between items-center bg-blue-600 dark:bg-blue-800 p-4 text-white rounded-lg shadow-md">
        <Image src="/images/27-dff6c2520e4e6c7c8feb5a3f9ba36b1f-removebg-preview.png" alt="Logo 1" width={80} height={80} />
        <h1 className="text-2xl font-bold text-center">Toolpath for Incremental Sheet Forming</h1>
        <Image src="/images/IIT_Hyderabad_Insignia.svg.png" alt="Logo 2" width={80} height={80} />
      </header>

      <h2 className="text-xl font-semibold mt-4 text-center dark:text-white animate-fade-in">Welcome, {user.name}!</h2>

      <Card className="bg-white dark:bg-gray-900 mt-6 w-full max-w-lg shadow-xl">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold dark:text-white">Upload Your File</h2>
          <Input type="file" accept=".step,.stp,.stl" onChange={handleFileChange} required />
          <Input type="number" name="incremental_depth" value={formData.incremental_depth} onChange={handleChange} placeholder="Incremental Depth (mm)" required />
          <Input type="number" name="tool_dia" value={formData.tool_dia} onChange={handleChange} placeholder="Tool Diameter (mm)" required />
          <Input type="number" name="feedrate" value={formData.feedrate} onChange={handleChange} placeholder="Feedrate (mm/min)" required />
          <Button type="submit" className="w-full">Upload and Convert</Button>
        </CardContent>
      </Card>

      <div className="w-full mt-6 flex justify-center items-center">
  <div
    ref={viewerRef}
    className="w-full max-w-[1200px] h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-500 animate-fade-in"
  />
</div>


      <footer className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <p>© 2024 Incremental Forming. All rights reserved.</p>
      </footer>
    </div>
  );
}