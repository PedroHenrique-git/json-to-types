import { ReceiveAction } from "./constants";
import { event } from "./lib/helpers/dom/event";
import { get } from "./lib/helpers/dom/get";
import * as monaco from "monaco-editor";
import Toastify from "toastify-js";

import "toastify-js/src/toastify.css";
import "./styles/main.css";

interface Params {
  inputIdentifier: string;
  outputIdentifier: string;
  downloadIdentifier: string;
  uploadIdentifier: string;
  copyIdentifier: string;
}

function App({
  inputIdentifier,
  outputIdentifier,
  uploadIdentifier,
  downloadIdentifier,
  copyIdentifier,
}: Params) {
  const $input = get<HTMLTextAreaElement>(inputIdentifier)!;
  const $output = get<HTMLTextAreaElement>(outputIdentifier)!;
  const $upload = get<HTMLInputElement>(uploadIdentifier)!;
  const $download = get<HTMLInputElement>(downloadIdentifier)!;
  const $copy = get<HTMLButtonElement>(copyIdentifier)!;

  const inputEditor = monaco.editor.create($input, {
    language: "json",
    automaticLayout: true,
    minimap: { enabled: false },
  });

  const outputEditor = monaco.editor.create($output, {
    language: "typescript",
    automaticLayout: true,
    minimap: { enabled: false },
  });

  const worker = new Worker(new URL("./workers/worker.ts", import.meta.url), {
    type: "module",
  });

  inputEditor.onDidChangeModelContent(() => {
    worker.postMessage({ type: "PROCESS", payload: inputEditor.getValue() });
  });

  event($upload, "change", async () => {
    const file = Array.from($upload.files ?? []).at(0);

    if (!file) {
      return;
    }

    worker.postMessage({ type: "UPLOAD", payload: file });
  });

  event($download, "click", () => {
    $download.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        outputEditor.getValue()
      )}`
    );
  });

  event($copy, "click", () => {
    navigator.clipboard.writeText(outputEditor.getValue()).then(() =>
      Toastify({
        text: "Types copied successfully",
        style: {
          background: "var(--main-text-color)",
          "box-shadow": "none",
          color: "var(--main-bg-color)",
        },
      }).showToast()
    );
  });

  worker.addEventListener("message", (evt: MessageEvent<ReceiveAction>) => {
    const { type, payload } = evt.data;

    switch (type) {
      case "UPLOAD":
        inputEditor.setValue(payload);
        break;

      case "PROCESS":
        outputEditor.setValue(payload);
        break;

      default:
        console.error("Invalid action");
        break;
    }
  });
}

App({
  inputIdentifier: "[data-input]",
  outputIdentifier: "[data-output]",
  downloadIdentifier: "[data-download]",
  uploadIdentifier: "[data-upload]",
  copyIdentifier: "[data-copy]",
});
