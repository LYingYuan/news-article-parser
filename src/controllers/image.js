import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = "../public/images";

async function downloadImage(req, res) {
  try {
    const filename = req.params.filename;
    const directoryPath = path.join(__dirname, IMAGES_DIR);
    const filePath = path.join(directoryPath, filename);

    res.download(filePath, filename, err => {
      if (err) {
        // Send an error response only if the download hasn't started
        res.status(500).send("Can't download image");
      }
    });
  } catch (error) {
    console.error(`Error downloading image: `, error.message);
    if (!res.headersSent) {
      res.status(500).send({ error: error.message });
    }
  }
}


export default downloadImage;
