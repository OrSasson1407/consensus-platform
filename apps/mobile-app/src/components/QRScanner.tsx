import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface QRScannerProps {
  onScan: (roomId: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required to scan QR codes.</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    // Expected URL: https://consensus.app/join/<roomId>
    const match = data.match(/\/join\/([a-f0-9-]{36})/);
    if (match) {
      onScan(match[1]);
    } else {
      Alert.alert("Invalid QR", "This QR code is not a valid ConsensuS room.", [
        { text: "Try Again", onPress: () => setScanned(false) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.hint}>Point at a ConsensuS room QR code</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  scanBox: { width: 260, height: 260, borderWidth: 2, borderColor: "#7c3aed", borderRadius: 16, backgroundColor: "transparent" },
  hint: { color: "#fff", marginTop: 20, fontSize: 14, opacity: 0.8 },
  text: { color: "#fff", fontSize: 16, textAlign: "center", paddingHorizontal: 32 },
  btn: { marginTop: 20, backgroundColor: "#7c3aed", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  closeBtn: { marginTop: 32, backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});