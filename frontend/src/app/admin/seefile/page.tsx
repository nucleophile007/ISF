"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;
const FILES_PER_PAGE = 5;

export default function SeeFilePage() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFiles = () => {
    fetch(`${API}/api/admin/files`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching files:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownload = (filename: string) => {
    const url = `${API}/api/admin/download/${encodeURIComponent(filename)}`;
    window.open(url, "_blank");
  };

  const handleDelete = async (filename: string) => {
    const confirmed = confirm(`Are you sure you want to delete "${filename}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API}/api/admin/delete/${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => prev.filter((file) => file !== filename));
        setSelectedFiles((prev) => {
          const updated = new Set(prev);
          updated.delete(filename);
          return updated;
        });
      } else {
        alert("Failed to delete file: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Error deleting file");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    const confirmed = confirm(`Delete ${selectedFiles.size} selected file(s)?`);
    if (!confirmed) return;

    for (const filename of selectedFiles) {
      await handleDelete(filename);
    }
  };

  const toggleFileSelection = (filename: string) => {
    setSelectedFiles((prev) => {
      const updated = new Set(prev);
      if (updated.has(filename)) {
        updated.delete(filename);
      } else {
        updated.add(filename);
      }
      return updated;
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(files.length / FILES_PER_PAGE);
  const paginatedFiles = files.slice(
    (currentPage - 1) * FILES_PER_PAGE,
    currentPage * FILES_PER_PAGE
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Files in STEPonly Folder</h1>

      <div className="flex justify-between mb-4 items-center">
        <button
          disabled={selectedFiles.size === 0}
          onClick={handleBulkDelete}
          className={`px-4 py-2 rounded text-white ${
            selectedFiles.size === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-800"
          }`}
        >
          Delete Selected ({selectedFiles.size})
        </button>

        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {paginatedFiles.map((file) => (
            <li
              key={file}
              className="flex justify-between items-center p-3 bg-gray-100 rounded"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file)}
                  onChange={() => toggleFileSelection(file)}
                />
                <span>{file}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
