import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/roomStore';
import { api } from '../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, setAuth, clearAuth } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch updated user info on mount if session is active
  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      try {
        const freshUser = await api.getMe();
        setDisplayName(freshUser.display_name);
        // Sync cache
        const token = useAuthStore.getState().token;
        if (token) {
          await setAuth(token, freshUser);
        }
      } catch (err: any) {
        console.warn('Could not sync user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [setAuth]);

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      setErrorMsg('Display name cannot be blank.');
      return;
    }

    setErrorMsg(null);
    setSaving(true);

    try {
      const updatedUser = await api.updateMe({ display_name: displayName.trim() });
      const token = useAuthStore.getState().token;
      if (token) {
        await setAuth(token, updatedUser);
      }
      Alert.alert('Success', 'Profile updated correctly!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to end your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', style: 'destructive', 
          onPress: async () => {
            await clearAuth();
            navigation.popToTop();
            navigation.navigate('Onboarding');
          } 
        }
      ]
    );
  };

  const initials = user?.display_name ? user.display_name.charAt(0).toUpperCase() : 'U';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarCircleBig}>
            <Text style={styles.avatarCircleBigText}>{initials}</Text>
          </View>
          <Text style={styles.userTitle}>{user?.display_name || 'My Profile'}</Text>
          <Text style={styles.userRegistrationDate}>ConsensuS Member</Text>
        </View>

        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Profile Card */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeader}>Manage Details</Text>
          
          <Text style={styles.label}>Phone Number (Read-only)</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.phone_number || ''}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Jane Doe"
            placeholderTextColor="#4b5563"
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={20}
          />

          <TouchableOpacity
            style={[styles.buttonPrimary, !displayName.trim() && styles.buttonDisabled]}
            onPress={handleUpdateProfile}
            disabled={saving || loading}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Logout Control */}
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.buttonLogoutText}>Log Out Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarCircleBig: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.5)',
    marginBottom: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarCircleBigText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
  },
  userTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f9fafb',
    marginBottom: 4,
  },
  userRegistrationDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#111118',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f1f35',
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e5e7eb',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0a0a0f',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 12,
    color: '#f9fafb',
    padding: 14,
    fontSize: 15,
    marginBottom: 20,
  },
  inputDisabled: {
    borderColor: '#111118',
    color: '#4b5563',
    backgroundColor: '#07070a',
  },
  buttonPrimary: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonLogout: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonLogoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  }
});
