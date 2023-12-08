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
      return url;
    }

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

    const newUrl = `http://localhost:3000/download/${filename}.${formatTarget}`;

    console.log("🧐ELowen - handleImage - newUrl:", newUrl)
    // return `http://elowen.life:30000/download/${filename}.${formatTarget}`;
    return newUrl;
  } catch (error) {
    console.error(`Error handling image: ${error.message}`);
    throw error;
  }
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
