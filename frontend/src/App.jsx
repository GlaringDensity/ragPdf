import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ChatSection from "./components/ChatSection";
import PDFViewer from "./components/PDFViewer";

function App() {

  const [file, setFile] = useState(null);

  const [uploaded, setUploaded] = useState(false);

  return (

    <div className="h-screen bg-[#020617] text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        file={file}
        setFile={setFile}
        uploaded={uploaded}
        setUploaded={setUploaded}
      />

      {/* PDF PREVIEW */}
      <div className="flex-1 bg-[#071029] overflow-y-auto border-r border-gray-800">

        {file ? (

          <PDFViewer fileUrl={file} />

        ) : (

          <div className="h-full flex items-center justify-center text-gray-500 text-xl">

            PDF preview will appear here

          </div>
        )}

      </div>

      {/* CHAT */}
      <ChatSection uploaded={uploaded} />

    </div>
  );
}

export default App;