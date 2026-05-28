import { useEffect, useState } from "react";

import {
  Document,
  Page,
  pdfjs
} from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {

  const [numPages, setNumPages] =
    useState(null);

  const [pageWidth, setPageWidth] =
    useState(600);

  useEffect(() => {

    function updateWidth() {

      const width =
        window.innerWidth * 0.38;

      setPageWidth(
        Math.min(width, 800)
      );
    }

    updateWidth();

    window.addEventListener(
      "resize",
      updateWidth
    );

    return () =>
      window.removeEventListener(
        "resize",
        updateWidth
      );

  }, []);

  function onDocumentLoadSuccess({
    numPages
  }) {

    setNumPages(numPages);
  }

  if (!fileUrl) {

    return (

      <div className="h-full flex items-center justify-center text-gray-500 text-xl">

        PDF preview will appear here

      </div>
    );
  }

  return (

    <div className="overflow-auto h-full w-full p-4 flex flex-col items-center">

      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
      >

        {numPages &&
          Array.from(
            new Array(numPages),
            (el, index) => (

              <div
                key={`page_${index + 1}`}
                className="mb-6"
              >

                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
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
