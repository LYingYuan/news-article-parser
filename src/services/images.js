import path from "path";
import fetch from "node-fetch";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { promises as fsPromises, createWriteStream } from "fs";
const { unlink } = fsPromises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = "../public/images";

async function handleImage(url, formatSource = "webp", formatTarget = "jpeg") {
  try {
    const { filename, extension } = extractFilenameAndExtension(url);
    if (extension !== formatSource) {
      return downloadSourceImage(url);
    }

    console.log("Handling img:\n");
    console.log(url);

    // Download
    const response = await fetch(url);
    const name = `${filename}.${extension}`;

    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

    const fileStream = createWriteStream(path.join(__dirname, IMAGES_DIR, name));

    await new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
      response.body.pipe(fileStream).on("error", reject);
    });

    // Convert
    const imagePath = path.join(__dirname, IMAGES_DIR, name);
    const imageTarget = imagePath.replace(`.${formatSource}`, `.${formatTarget}`);

    await sharp(imagePath).toFormat(formatTarget).toFile(imageTarget);

    // Delete raw image
    await unlink(imagePath);

    // const newUrl = `http://localhost:3000/download/${filename}.${formatTarget}`;
    const newUrl = `http://8.222.236.178:3000/download/${filename}.${formatTarget}`;

    return newUrl;
  } catch (error) {
    console.error(`Error handling image: ${error.message}`);
    throw error;
  }
}

async function downloadSourceImage(url) {
  const { filename, extension } = extractFilenameAndExtension(url);

  const response = await fetch(url);
  const name = `${filename}.${extension}`;

  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

  const fileStream = createWriteStream(path.join(__dirname, IMAGES_DIR, name));

  await new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
    response.body.pipe(fileStream).on("error", reject);
  });

  // const newUrl = `http://localhost:3000/download/${filename}.${extension}`;
  const newUrl = `http://8.222.236.178:3000/download/${filename}.${extension}`;

  return newUrl;
}

function extractFilenameAndExtension(url) {
  const regex = /([^\/]+)(\.\w+)$/;
  const matches = regex.exec(url);

  return {
    filename: matches ? matches[1] : undefined,
    extension: matches ? matches[2].slice(1) : undefined,
  };
}

export default handleImage;
