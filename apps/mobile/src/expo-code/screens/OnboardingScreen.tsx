import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/roomStore';
import { api } from '../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your phone number');
      return;
    }
    if (!displayName.trim()) {
      setErrorMsg('Please enter a display name');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.register({
        phone_number: phoneNumber.trim(),
        display_name: displayName.trim(),
      });
      
      // Save session in Store & Storage
      await setAuth(response.token, response.user);
      
      // Direct navigation to home hub
      navigation.navigate('RoomCreate');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.brandingContainer}>
          <Text style={styles.appName}>ConsensuS</Text>
          <Text style={styles.tagline}>"Tinder for group decisions"</Text>
          <Text style={styles.description}>
            Create rooms, pick activities, and swipe together. Everyone liked it? It's a match!
          </Text>
        </View>

        <View style={styles.formContainer}>
          {errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="054-000-0000"
            placeholderTextColor="#4b5563"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
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
            style={[styles.button, (!phoneNumber.trim() || !displayName.trim()) && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#f9fafb',
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c3aed',
    marginTop: 4,
    letterSpacing: 1.2,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
    maxWidth: 280,
  },
  formContainer: {
    backgroundColor: '#111118',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f1f35',
    padding: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
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
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  }
});
