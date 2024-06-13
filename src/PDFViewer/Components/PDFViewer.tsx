import React, { useState } from "react";

// Import Worker
import { Worker } from "@react-pdf-viewer/core";
// Import the main Viewer component
import { Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
// default layout plugin
// Import styles of default layout plugin
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import axios from "axios";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";

interface IPDFProps {
  fileId: number | string;
}

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PDFViewer(props: IPDFProps) {
  const { fileId } = props;

  // creating new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const toolbarPluginInstance = toolbarPlugin();

  // pdf file onChange state
  const [pdfFile, setPdfFile] = useState("");

  React.useMemo(() => {
    axios({
      method: "GET",
      url: `http://194.113.194.151:8080/Document/DownlaodFile?id=${fileId}`,
      responseType: "blob",
    }).then(
      function (response) {
        const blob = new Blob([response.data], {
          type: "application/pdf",
        });
        const fileURL = URL.createObjectURL(blob);

        setPdfFile(fileURL);
      },
      function (error) {
        setPdfFile("");
      }
    );
  }, [fileId]);

  return (
    <React.Fragment>
      {/* <iframe
        width={"400px"}
        title="pdf document"
        id="print-file"
        src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
      /> */}
      {/* <Document
        file={`data:application/pdf;base64,${pdfString}`}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document> */}
      <div style={{ width: "700px" }}>
        {/* render this if we have a pdf file */}
        {pdfFile && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfFile}
              plugins={[defaultLayoutPluginInstance]}
            ></Viewer>
          </Worker>
        )}

        {/* render this if we have pdfFile state null   */}
        {!pdfFile && <>No file is selected yet</>}
        {/* <iframe
          src="https://view.officeapps.live.com/op/embed.aspx?src=${url}"
          width="1366px"
          height="623px"
        >
          This is an embedded{" "}
          <a target="_blank" href="http://office.com">
            Microsoft Office
          </a>{" "}
          document, powered by{" "}
          <a target="_blank" href="http://office.com/webapps">
            Office Online
          </a>
          .
        </iframe> */}
      </div>
    </React.Fragment>
  );
}
