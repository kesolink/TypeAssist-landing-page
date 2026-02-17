// Download configuration for TypeAssist installers
export const LATEST_VERSION = "1.0.0";

// GitHub Release URLs
const GITHUB_REPO = "kesolink/typeassist-app";
const RELEASE_TAG = `v${LATEST_VERSION}`;

export const DOWNLOAD_URLS = {
  windows: {
    url: `https://github.com/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/TypeAssist.Setup.${LATEST_VERSION}.exe`,
    filename: `TypeAssist.Setup.${LATEST_VERSION}.exe`,
    platform: "Windows",
    minVersion: "Windows 10",
    size: "~150 MB",
  },
  mac: {
    url: `https://github.com/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/TypeAssist-${LATEST_VERSION}.dmg`,
    filename: `TypeAssist-${LATEST_VERSION}.dmg`,
    platform: "macOS",
    minVersion: "macOS 11 (Big Sur)",
    size: "~110 MB",
  }
};

// Helper function for triggering downloads
export const handleDownload = (platform) => {
  const download = DOWNLOAD_URLS[platform];
  if (download) {
    console.log(`Download started: ${platform} - ${download.filename}`);
    window.location.href = download.url;
  }
};
