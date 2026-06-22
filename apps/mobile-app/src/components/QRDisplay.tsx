import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Share } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface QRDisplayProps {
  roomId: string;
  joinUrl: string;
  onClose?: () => void;
}

export default function QRDisplay({ roomId, joinUrl, onClose }: QRDisplayProps) {
  const handleShare = async () => {
    await Share.share({ message: `Join my ConsensuS room: ${joinUrl}`, url: joinUrl });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Room</Text>
      <Text style={styles.subtitle}>Scan to join</Text>
      <View style={styles.qrWrapper}>
        <QRCode value={joinUrl} size={220} color="#1a1a2e" backgroundColor="#fff" />
      </View>
      <Text style={styles.roomId}>Room: {roomId.slice(0, 8).toUpperCase()}</Text>
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Text style={styles.shareBtnText}>Share Link</Text>
      </TouchableOpacity>
      {onClose && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23", alignItems: "center", justifyContent: "center", padding: 24 },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "#a78bfa", fontSize: 14, marginBottom: 32 },
  qrWrapper: { backgroundColor: "#fff", padding: 16, borderRadius: 20, shadowColor: "#7c3aed", shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  roomId: { color: "#6b7280", fontSize: 13, marginTop: 20, letterSpacing: 2 },
  shareBtn: { marginTop: 24, backgroundColor: "#7c3aed", paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14 },
  shareBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  closeBtn: { marginTop: 12, padding: 12 },
  closeText: { color: "#6b7280", fontSize: 14 },
});