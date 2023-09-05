function isValidWebsite(input) {
  // Regular expression to match a simple URL pattern
  const urlPattern =
    /^(https?:\/\/)?([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+([a-zA-Z]{2,9})(:\d{1,5})?(\/\S*)?)$/i;

  return urlPattern.test(input);
}

async function doesWebsiteExist(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });

    // Check if the status code is in the 200-299 range (indicating a successful response).
    if (response.status >= 200 && response.status < 300) {
      return true;
    } else if (response.status === 403) {
      return isValidWebsite(url);
    } else {
      return false;
    }
  } catch (error) {
    // An error occurred, which likely means the website doesn't exist or there was a network issue.
    return false;
  }
}
