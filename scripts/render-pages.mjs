import { writeFile, copyFile } from "node:fs/promises";
import { default as worker } from "../dist/server/index.js";

const APP_URL = "https://hancyhxy.github.io/ultrasound-cityecho/";
const ROOT_URL = `${APP_URL}`;

async function render(url) {
  const response = await worker.fetch(new Request(url));
  if (!response.ok) {
    throw new Error(`Render failed for ${url}: ${response.status}`);
  }
  return response.text();
}

const html = await render(ROOT_URL);

await writeFile(new URL("../dist/client/index.html", import.meta.url), html);
await copyFile(
  new URL("../dist/client/index.html", import.meta.url),
  new URL("../dist/client/404.html", import.meta.url),
);
await writeFile(new URL("../dist/client/.nojekyll", import.meta.url), "");
