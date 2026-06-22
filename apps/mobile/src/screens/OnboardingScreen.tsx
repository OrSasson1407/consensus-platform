import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
// Proactively wire to your Zustand auth store
import { useAuthStore } from '../stores/useAuthStore'; 

export default function OnboardingScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Zustand hook binding
  const setAuth = useAuthStore((state: any) => state?.setAuth || null);

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 0) {
      const match = cleaned.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        formatted = !match[2]
          ? match[1]
          : `(${match[1]}) ${match[2]}` + (match[3] ? `-${match[3]}` : '');
      }
    }
    setPhoneNumber(formatted);
  };

  const handleRegister = async () => {
    if (!phoneNumber || !displayName) {
      Alert.alert('Required Fields', 'Please complete both fields to start deciding.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API or payload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (setAuth) {
        setAuth({
          token: 'mock-session-jwt-10924',
          user: {
            phone: `+1 ${phoneNumber}`,
            name: displayName,
            handle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`
          }
        });
      }
      
      // Navigate to Explore
      if (navigation) {
        navigation.replace('Explore');
      } else {
        Alert.alert('Onboarding Action Success', `Welcome, ${displayName}!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Subtle Background Glow Inset */}
        <View style={styles.gradientOrb} pointerEvents="none" />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.innerContainer}>
            {/* Brand Header */}
            <View style={styles.brandHeader}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>EST. 2024</Text>
              </View>
              <Text style={styles.brandTitle}>ConsensuS</Text>
              <Text style={styles.brandSubtitle}>
                Collective decisions, made simple. Join the social pulse.
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formGroup}>
              {/* Phone Input */}
              <View style={styles.inputStack}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📞</Text>
                  <Text style={styles.phoneCountry}>
                    +1
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="(555) 000-0000"
                    placeholderTextColor="rgba(149, 141, 161, 0.5)"
                    keyboardType="phone-pad"
                    maxLength={14}
                    value={phoneNumber}
                    onChangeText={formatPhoneNumber}
                  />
                </View>
              </View>

              {/* Name Input */}
              <View style={styles.inputStack}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Choose your handle"
                    placeholderTextColor="rgba(149, 141, 161, 0.5)"
                    autoCapitalize="words"
                    value={displayName}
                    onChangeText={setDisplayName}
                  />
                </View>
              </View>

              {/* Get Started Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#EDE0FF" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Get Started</Text>
                    <Text style={styles.buttonArrow}>➔</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer Rules */}
            <Text style={styles.footerTerms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>.
            </Text>
          </View>
        </KeyboardAvoidingView>

        {/* Visual Anchor Glow / Bottom Decorative Container */}
        <View style={styles.bottomDecorativeGlow} pointerEvents="none" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  keyboardContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  gradientOrb: {
    position: 'absolute',
    top: -150,
    left: '50%',
    marginLeft: -400,
    width: 800,
    height: 480,
    borderRadius: 400,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    opacity: 0.7,
  },
  brandHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  badgeContainer: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#d2bbff',
    letterSpacing: 1.6,
  },
  brandTitle: {
    fontFamily: 'System',
    fontSize: 52,
    fontWeight: '800',
    color: '#e4e1e9',
    letterSpacing: -1,
    marginBottom: 8,
  },
  brandSubtitle: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '400',
    color: '#ccc3d8',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  formGroup: {
    width: '100%',
    marginVertical: 20,
  },
  inputStack: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#ccc3d8',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 17, 24, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(31, 31, 53, 0.7)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#d2bbff',
  },
  phoneCountry: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#e4e1e9',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#e4e1e9',
    height: '100%',
  },
  primaryButton: {
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    color: '#ede0ff',
    marginRight: 8,
  },
  buttonArrow: {
    fontSize: 18,
    color: '#ede0ff',
  },
  footerTerms: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#ccc3d8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  termsHighlight: {
    color: '#d2bbff',
    fontWeight: '700',
  },
  bottomDecorativeGlow: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#7c3aed',
    opacity: 0.15,
    borderRadius: 100,
    blur: 50,
  }
});
