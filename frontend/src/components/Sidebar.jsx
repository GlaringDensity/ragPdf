import axios from "axios";

import { useState } from "react";

function Sidebar({
  file,
  setFile,
  uploaded,
  setUploaded
}) {

  const [uploading, setUploading] = useState(false);

  async function handleUpload() {

    if (!file) {

      alert("Please select a PDF");

      return;
    }

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("pdf", file);

      await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      setUploaded(true);

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }

    setUploading(false);
  }

  return (

    <div className="w-[300px] bg-[#0F172A] border-r border-gray-800 flex flex-col p-6">

      <div>

        <h1 className="text-4xl font-bold">
          PDF AI
        </h1>

        <p className="text-gray-400 mt-2 text-sm leading-6">

          Retrieval-Augmented Generation

        </p>

      </div>

      {/* Upload Card */}
      <div className="mt-10 bg-[#111827] border border-gray-800 rounded-3xl p-5">

        <h2 className="text-2xl font-semibold mb-6">

          Upload PDF

        </h2>

        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {

            e.preventDefault();

            if (e.dataTransfer.files[0]) {

              setFile(e.dataTransfer.files[0]);
            }
          }}
          className="h-52 border border-dashed border-gray-600 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-all"
        >

          <div className="text-5xl mb-4">
            📄
          </div>

          <p className="text-gray-300 px-6">

            Drag & drop or click to upload PDF

          </p>

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

        </label>

        {file && (

          <div className="mt-5 bg-[#1E293B] rounded-2xl p-4">

            <p className="text-xs text-gray-400 mb-2">

              Selected File

            </p>

            <p className="text-sm break-words">

              {file.name}

            </p>

          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl py-4 font-medium text-lg"
        >

          {uploading
            ? "Uploading..."
            : "Upload PDF"}

        </button>

      </div>

      {/* Status */}
      <div
        className={`mt-6 rounded-2xl px-5 py-4 text-sm border ${
          uploaded
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
        }`}
      >

        {uploaded
          ? "PDF uploaded successfully"
          : "No PDF uploaded"}

      </div>

      <div className="mt-auto text-xs text-gray-500 leading-6">

        Built with React + Node.js + RAG

      </div>

    </div>
  );
}

export default Sidebar;