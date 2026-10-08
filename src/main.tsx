import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/css/styles.css";
import "./aws/amplify-config";
import { App } from "./app/App";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
