import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import { createRoom, joinRoom } from "../services/api";
import { useAppStore } from "../store/appStore";
import QRScanner from "../components/QRScanner";
import QRDisplay from "../components/QRDisplay";

const CATEGORIES = ["MOVIES", "RESTAURANTS", "ACTIVITIES"] as const;

export default function ExploreScreen() {
  const router = useRouter();
  const { setRoom, currentRoom, user } = useAppStore();
  const [selected, setSelected] = useState<typeof CATEGORIES[number]>("MOVIES");
  const [showScanner, setShowScanner] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { data } = await createRoom(selected);
      setRoom(data);
      setShowQR(true);
    } finally { setLoading(false); }
  };

  const handleJoinQR = async (roomId: string) => {
    setShowScanner(false);
    try {
      const { data } = await joinRoom(roomId);
      setRoom(data);
      router.push("/(tabs)/swipe");
    } catch {}
  };

  const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL ?? "https://consensus.app";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Session</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.cat, selected === c && styles.catSelected]} onPress={() => setSelected(c)}>
            <Text style={[styles.catText, selected === c && styles.catTextSelected]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={loading}>
        <Text style={styles.createBtnText}>{loading ? "Creating..." : "Create Room"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.scanBtn} onPress={() => setShowScanner(true)}>
        <Text style={styles.scanBtnText}>📷  Scan QR to Join</Text>
      </TouchableOpacity>

      <Modal visible={showScanner} animationType="slide">
        <QRScanner onScan={handleJoinQR} onClose={() => setShowScanner(false)} />
      </Modal>

      <Modal visible={showQR} animationType="slide">
        <QRDisplay
          roomId={currentRoom?.id ?? ""}
          joinUrl={`${baseUrl}/join/${currentRoom?.id}`}
          onClose={() => { setShowQR(false); router.push("/(tabs)/swipe"); }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23", padding: 24, paddingTop: 64 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 32 },
  categoryRow: { flexDirection: "row", gap: 10, marginBottom: 32 },
  cat: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: "#1f1f3a", borderWidth: 1, borderColor: "#374151" },
  catSelected: { backgroundColor: "#7c3aed", borderColor: "#7c3aed" },
  catText: { color: "#6b7280", fontWeight: "600", fontSize: 13 },
  catTextSelected: { color: "#fff" },
  createBtn: { backgroundColor: "#7c3aed", padding: 18, borderRadius: 14, alignItems: "center", marginBottom: 14 },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 17 },
  scanBtn: { backgroundColor: "#1f1f3a", padding: 16, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "#374151" },
  scanBtnText: { color: "#a78bfa", fontWeight: "600", fontSize: 16 },
});