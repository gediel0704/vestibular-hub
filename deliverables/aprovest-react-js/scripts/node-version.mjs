export function supportedNodeVersion(version) {
  const [major, minor] = version.replace(/^v/, "").split(".").map(Number);

  return (major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major >= 24;
}
