import { isUri } from "valid-url";

export function isValidUrlArray(urls: any): urls is string[] {
  return Array.isArray(urls) && urls.every(url => typeof url === "string" && isUri(url));
}
