
export const getAccessToken = () => {
  try {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    return token;
  } catch (e) {
    console.error("Failed to retrieve access token:", e);
    return null;
  }
};
