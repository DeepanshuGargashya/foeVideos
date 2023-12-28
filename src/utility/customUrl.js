import { URL } from "url";

const customizeUrl = (originalUrl, customParameter) => {
  // Parse the original URL
  const parsedUrl = new URL(originalUrl);

  // Append a custom query parameter
  parsedUrl.searchParams.set("customParam", customParameter);

  // Return the customized URL
  return parsedUrl.toString();
};

export default customizeUrl;
