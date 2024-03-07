export function readJsonFile(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", (evt) => {
      resolve(JSON.parse(String(evt.target?.result)));
    });

    reader.readAsText(file);
  });
}
