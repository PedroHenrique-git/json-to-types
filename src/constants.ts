export type SendAction =
  | { type: "UPLOAD"; payload: File }
  | { type: "PROCESS"; payload: string };

export type ReceiveAction =
  | { type: "UPLOAD"; payload: string }
  | { type: "PROCESS"; payload: string };
