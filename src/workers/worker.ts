import { run } from "json_typegen_wasm";
import { SendAction } from "../constants";
import { readJsonFile } from "../lib/helpers/file/readJsonFile";

addEventListener("message", (evt: MessageEvent<SendAction>) => {
  const { type, payload } = evt.data;

  switch (type) {
    case "UPLOAD": {
      readJsonFile(payload).then((json) => {
        postMessage({
          type: "UPLOAD",
          payload: JSON.stringify(json, undefined, 2),
        });
      });

      break;
    }

    case "PROCESS": {
      postMessage({
        type: "PROCESS",
        payload: run(
          "Root",
          payload,
          JSON.stringify({ output_mode: "typescript" })
        ),
      });

      break;
    }

    default:
      console.error("Invalid action");
      break;
  }
});
