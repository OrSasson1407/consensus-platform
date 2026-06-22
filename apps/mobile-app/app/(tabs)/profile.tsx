import { View, Text, StyleSheet } from "react-native";
import { useAppStore } from "../../src/store/appStore";
export default function ProfileTab() {
  const user = useAppStore((s) => s.user);
  return <View style={s.c}><Text style={s.t}>{user?.display_name}</Text></View>;
}
const s = StyleSheet.create({ c: { flex:1, backgroundColor:"#0f0f23", alignItems:"center", justifyContent:"center" }, t: { color:"#fff", fontSize:20 } });