import QRCode from "qrcode";

export async function generateRoomQR(
  roomId: string,
  baseUrl: string = "https://consensus.app"
): Promise<string> {
  const joinUrl = `${baseUrl}/join/${roomId}`;
  // Returns base64 PNG data URL
  return QRCode.toDataURL(joinUrl, {
    errorCorrectionLevel: "M",
    width: 300,
    margin: 2,
    color: { dark: "#1a1a2e", light: "#ffffff" },
  });
}

export async function generateRoomQRBuffer(roomId: string, baseUrl: string = "https://consensus.app"): Promise<Buffer> {
  const joinUrl = `${baseUrl}/join/${roomId}`;
  return QRCode.toBuffer(joinUrl, { errorCorrectionLevel: "M", width: 300, margin: 2 });
}