import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  async function handleUpload() {

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("pdf", file);

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      console.log(response.data);

      alert("PDF uploaded successfully!");

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }

    setUploading(false);
  }

  async function askQuestion() {

    if (!question) return;

    const userMessage = {
      role: "user",
      content: question
    };

    setMessages(prev => [...prev, userMessage]);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          question
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources
      };

      setMessages(prev => [...prev, aiMessage]);

      setQuestion("");

    } catch (error) {

      console.log(error);

      alert("Question failed");
    }
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h1 className="text-3xl font-bold mb-2">
            AI PDF Assistant
          </h1>

          <p className="text-gray-500 mb-6">
            Upload a PDF and ask questions using RAG AI.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-black text-white px-4 py-3 rounded-xl w-full hover:opacity-90"
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>

        </div>

        {/* CHAT PANEL */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col h-[80vh]">

          <div className="flex-1 overflow-y-auto space-y-4">

            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-20">
                Ask questions about your uploaded PDF
              </div>
            )}

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-100 ml-auto max-w-[80%]"
                    : "bg-gray-100 max-w-[80%]"
                }`}
              >

                <p className="whitespace-pre-wrap">
                  {msg.content}
                </p>

                {msg.sources && (

                  <div className="mt-4 space-y-2">

                    <p className="font-semibold text-sm">
                      Sources:
                    </p>

                    {msg.sources.map((source, idx) => (

                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg text-sm border"
                      >
                        {source.snippet}
                      </div>
                    ))}

                  </div>
                )}

              </div>
            ))}

          </div>

          {/* INPUT */}
          <div className="mt-4 flex gap-2">

            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-3 outline-none"
            />

            <button
              onClick={askQuestion}
              className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;