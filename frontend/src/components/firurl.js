export const fixUrl = (url) => {
    let decoded=decodeURIComponent(feed.image).replace(/^\/+/, '').replace("https://connectu-social-media-jhi7.onrender.com/",'');

  // Ensure it has https:// not https:/
  if (decoded.startsWith("https:/") && !decoded.startsWith("https://")) {
    decoded = decoded.replace("https:/", "https://");
  }
  return decoded;
};
