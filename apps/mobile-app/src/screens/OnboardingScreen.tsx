import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { register } from "../services/api";
import { useAppStore } from "../store/appStore";

export default function OnboardingScreen() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!phone.trim() || !name.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const { data } = await register(phone.trim(), name.trim());
      setAuth(data.user, data.token);
      router.replace("/(tabs)/explore");
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.logo}>ConsensuS</Text>
      <Text style={styles.tagline}>Decide together.</Text>
      <TextInput style={styles.input} placeholder="+1 555 0123" placeholderTextColor="#4b5563" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Display name" placeholderTextColor="#4b5563" value={name} onChangeText={setName} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleStart} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Loading..." : "Get Started"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23", alignItems: "center", justifyContent: "center", padding: 32 },
  logo: { color: "#a78bfa", fontSize: 40, fontWeight: "900", letterSpacing: 1.5 },
  tagline: { color: "#6b7280", fontSize: 16, marginBottom: 48, marginTop: 8 },
  input: { width: "100%", backgroundColor: "#1f1f3a", color: "#fff", padding: 16, borderRadius: 14, marginBottom: 14, fontSize: 16, borderWidth: 1, borderColor: "#374151" },
  btn: { width: "100%", backgroundColor: "#7c3aed", padding: 18, borderRadius: 14, alignItems: "center", marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  error: { color: "#ef4444", marginBottom: 8, fontSize: 13 },
});