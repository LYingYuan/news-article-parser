import { isUri } from "valid-url";

function isValidUrlArray(urls) {
  return Array.isArray(urls) && urls.every(url => typeof url === "string" && isUri(url));
}

export { isValidUrlArray };
