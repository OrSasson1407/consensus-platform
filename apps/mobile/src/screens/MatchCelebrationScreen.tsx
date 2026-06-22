import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
// Store integration triggered on rooms reset
import { useRoomStore } from '../stores/useRoomStore';

const { width } = Dimensions.get('window');

export default function MatchCelebrationScreen({ navigation }: any) {
  const resetRoomSelection = useRoomStore((state: any) => state?.reset || null);

  const handleStartNewRoom = () => {
    if (resetRoomSelection) {
      resetRoomSelection();
    }
    navigation?.replace('Explore');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background celebration glow */}
      <View style={styles.atmosphereGlow} pointerEvents="none" />
      
      {/* Static header bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>JD</Text>
          </View>
          <Text style={styles.brandTitle}>ConsensuS</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContent}>
        {/* Match description text */}
        <View style={styles.celebrateHeader}>
          <Text style={styles.alertLabel}>MATCH ACHIEVED</Text>
          <Text style={styles.mainTitle}>🎉 It's a Match!</Text>
        </View>

        {/* Celebration poster card */}
        <View style={styles.posterCard}>
          <Image
            style={styles.posterImage}
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDisbJuJVyTpwsJpAvEr4kzYf23E_g9KhoTYWwr-T_-39IY34pRPTeNteV8-TtGCUyW2Z0HFMHHOeDOJ1e-JEby2ifZVb1ACc_wBVXXHfmmNS0-J3NQ-r4WOWA3TgAW-GBpwWdAP1vsO9AE2GlKK8qz3t_It2oodZo98T6g_8jZMuzPlNkTr91zKCKpXl5TrCrwqBph-M7onglioGuEAT3T76ELayWPgRGesyojYqx-Gd4R9LEd6b-04U9uESCF3_Xw_SiKj3CFIWk' }}
            contentFit="cover"
          />
          <View style={styles.cardGradient} />
          
          <View style={styles.compatibilityBadge}>
            <Text style={styles.compatibilityText}>100% COMPATIBLE</Text>
          </View>

          <View style={styles.posterMetadata}>
            <Text style={styles.itemTitle}>Interstellar</Text>
            <Text style={styles.itemSubtitle}>You all agreed on this choice</Text>
            
            {/* Friends Avatars */}
            <View style={styles.avatarRow}>
              <View style={[styles.microAvatar, { backgroundColor: '#7c3aed' }]}>
                <Text style={styles.avatarLabel}>JD</Text>
              </View>
              <View style={[styles.microAvatar, { backgroundColor: '#00a572' }]}>
                <Text style={styles.avatarLabel}>MS</Text>
              </View>
              <View style={[styles.microAvatar, { backgroundColor: '#836100' }]}>
                <Text style={styles.avatarLabel}>AK</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dynamic CTA buttons */}
        <View style={styles.actionCard}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => Alert.alert('Playback', 'Launching Interstellar playback integration...')}
          >
            <Text style={styles.primaryBtnText}>Watch Now</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={handleStartNewRoom}
          >
            <Text style={styles.secondaryBtnText}>Start New Room</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.ghostBtn}
            onPress={() => Alert.alert('Share', 'Room match share details copied to clipboard')}
          >
            <Text style={styles.ghostBtnText}>Share with Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131318',
  },
  atmosphereGlow: {
    position: 'absolute',
    inset: 0,
    width: width,
    height: '100%',
    backgroundColor: 'rgba(251, 191, 36, 0.03)',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(19, 19, 24, 0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandBadgeText: {
    fontFamily: 'System',
    color: '#ede0ff',
    fontSize: 10,
    fontWeight: '800',
  },
  brandTitle: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '800',
    color: '#d2bbff',
    letterSpacing: -1,
  },
  settingsBtn: {
    padding: 4,
  },
  settingsIcon: {
    fontSize: 22,
    color: '#d2bbff',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  celebrateHeader: {
    alignItems: 'center',
    marginTop: 12,
  },
  alertLabel: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#fbbf24',
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '800',
    color: '#e4e1e9',
  },
  posterCard: {
    width: 280,
    height: 400,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f1f35',
    backgroundColor: '#111118',
    overflow: 'hidden',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  posterImage: {
    width: '100%',
    height: '67%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(17, 17, 24, 0.9)',
  },
  compatibilityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  compatibilityText: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '700',
    color: '#261a00',
    letterSpacing: 0.5,
  },
  posterMetadata: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  itemTitle: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '850',
    color: '#e4e1e9',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#ccc3d8',
    textAlign: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
    gap: -6,
  },
  microAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#111118',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontFamily: 'System',
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  actionCard: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 9999,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  primaryBtnText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    color: '#261a00',
  },
  secondaryBtn: {
    height: 54,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    color: '#fbbf24',
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  ghostBtnText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc3d8',
  }
});
