import { Document, Page, pdfjs } from "react-pdf";

import { useState } from "react";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

function PDFViewer({ file }) {

  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (!file) {

    return (

      <div className="h-full flex items-center justify-center text-gray-500">

        Upload a PDF to preview

      </div>
    );
  }

  return (

    <div className="h-full overflow-y-auto p-6">

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={
          <div className="text-gray-400">
            Loading PDF...
          </div>
        }
      >

        {
          Array.from(
            new Array(numPages),
            (_, index) => (

              <div
                key={index}
                className="mb-8 flex justify-center"
              >

                <Page
                  pageNumber={index + 1}
                  width={550}
                />

              </div>
            )
          )
        }

      </Document>

    </div>
  );
}

export default PDFViewer;