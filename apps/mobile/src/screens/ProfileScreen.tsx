import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
// Direct Zustand Hook mappings for edit name profile saves
import { useAuthStore } from '../stores/useAuthStore';

export default function ProfileScreen({ navigation }: any) {
  const user = useAuthStore((state: any) => state?.user) || {
    name: 'Jordan D.',
    phone: '+1 (555) 012-3456',
    email: 'jordan.d@example.com',
    handle: '@jordan_consensus'
  };
  const setAuth = useAuthStore((state: any) => state?.setAuth || null);

  const [displayName, setDisplayName] = useState(user.name);
  const [emailAddress, setEmailAddress] = useState(user.email);

  const handleSaveChanges = () => {
    if (!displayName) {
      Alert.alert('Required Error', 'Display name cannot be empty.');
      return;
    }
    
    if (setAuth) {
      setAuth({
        user: {
          ...user,
          name: displayName,
          email: emailAddress
        }
      });
    }

    Alert.alert('Success', 'Profile changes saved locally!');
  };

  const handleLogOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of ConsensuS?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive',
        onPress: () => {
          if (setAuth) setAuth(null);
          navigation?.replace('Onboarding');
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
            <Text style={styles.backIcon}>➔</Text> {/* Or native icon */}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Area */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradient}>
              <Text style={styles.avatarInitials}>
                {displayName.substring(0, 2).toUpperCase() || 'JD'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Text style={styles.editBadgeIcon}>✏️</Text>
            </TouchableOpacity>
            {/* Ambient visual glow blur */}
            <View style={styles.ambientGlow} />
          </View>

          {/* User Titles */}
          <View style={styles.titleArea}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userHandle}>{user.handle}</Text>
          </View>

          {/* Input Details */}
          <View style={styles.formGroup}>
            {/* Field: Display Name */}
            <View style={styles.fieldStack}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldIcon}>👤</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>
            </View>

            {/* Field: Verified Phone */}
            <View style={[styles.fieldStack, styles.readOnlyField]}>
              <Text style={styles.fieldLabel}>Verified Phone</Text>
              <View style={styles.readOnlyWrapper}>
                <Text style={styles.fieldIcon}>📞</Text>
                <TextInput
                  style={[styles.fieldInput, styles.fieldInputDisabled]}
                  value={user.phone}
                  editable={false}
                />
                <Text style={styles.verifiedBadge}>✓</Text>
              </View>
            </View>

            {/* Field: Email Address */}
            <View style={styles.fieldStack}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldIcon}>✉️</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Visual Flourish stats container */}
          <View style={styles.statsRow}>
            <View style={styles.statPanel}>
              <Text style={styles.statScorePrimary}>24</Text>
              <Text style={styles.statHeader}>ROOMS</Text>
            </View>
            <View style={styles.statPanel}>
              <Text style={styles.statScoreSec}>182</Text>
              <Text style={styles.statHeader}>MATCHES</Text>
            </View>
            <View style={styles.statPanel}>
              <Text style={styles.statScoreGold}>92%</Text>
              <Text style={styles.statHeader}>AGREE</Text>
            </View>
          </View>

          {/* Core Action CTA Buttons */}
          <View style={styles.actionsBox}>
            <TouchableOpacity 
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={handleSaveChanges}
            >
              <Text style={styles.primaryBtnText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutBtn}
              activeOpacity={0.8}
              onPress={handleLogOut}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          {/* Version identifier */}
          <Text style={styles.appVersion}>CONSENSU_S V2.4.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 15, 0.8)',
    borderBottomWidth: 1,
    borderColor: '#1f1f35',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    transform: [{ rotate: '180deg' }], // Simulates back arrow rotation
    fontSize: 18,
    color: '#ccc3d8',
  },
  headerTitle: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    color: '#e4e1e9',
  },
  settingsBtn: {
    padding: 4,
  },
  settingsIcon: {
    fontSize: 22,
    color: '#d2bbff',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollBody: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    zIndex: 10,
  },
  avatarInitials: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '800',
    color: '#ede0ff',
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d2bbff',
    borderWidth: 4,
    borderColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  editBadgeIcon: {
    fontSize: 14,
  },
  ambientGlow: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#7c3aed',
    opacity: 0.15,
    borderRadius: 60,
    blur: 32,
    zIndex: 1,
  },
  titleArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userName: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
    color: '#e4e1e9',
  },
  userHandle: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#ccc3d8',
    marginTop: 4,
  },
  formGroup: {
    gap: 20,
    marginBottom: 32,
  },
  fieldStack: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#ccc3d8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  fieldWrapper: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 17, 24, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f1f35',
    paddingHorizontal: 16,
  },
  readOnlyField: {
    opacity: 0.8,
  },
  readOnlyWrapper: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 68, 85, 0.1)',
    paddingHorizontal: 16,
  },
  fieldIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  fieldInput: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#e4e1e9',
    height: '100%',
  },
  fieldInputDisabled: {
    color: '#ccc3d8',
  },
  verifiedBadge: {
    fontSize: 14,
    color: '#4edea3',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  statPanel: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 24, 0.7)',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statScorePrimary: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    color: '#d2bbff',
  },
  statScoreSec: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    color: '#4edea3',
  },
  statScoreGold: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    color: '#f9bd22',
  },
  statHeader: {
    fontFamily: 'System',
    fontSize: 9,
    fontWeight: '700',
    color: '#ccc3d8',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  actionsBox: {
    gap: 16,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  primaryBtnText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#ede0ff',
  },
  logoutBtn: {
    height: 56,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  appVersion: {
    fontFamily: 'System',
    fontSize: 10,
    color: '#4a4455',
    textAlign: 'center',
    marginTop: 40,
    letterSpacing: 1.5,
  }
});
