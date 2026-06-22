/**
 * React Native (Expo) - Consolidated High Fidelity Source Code
 * Output files for ConsensuS mobile development.
 */

export const ONBOARDING_RN_CODE = `import React, { useState } from 'react';
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
    const cleaned = text.replace(/\\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 0) {
      const match = cleaned.match(/^(\\d{1,3})(\\d{0,3})(\\d{0,4})$/);
      if (match) {
        formatted = !match[2]
          ? match[1]
          : \`(\${match[1]}) \${match[2]}\` + (match[3] ? \`-\${match[3]}\` : '');
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
            phone: \`+1 \${phoneNumber}\`,
            name: displayName,
            handle: \`@\${displayName.toLowerCase().replace(/\\s+/g, '_')}\`
          }
        });
      }
      
      // Navigate to Explore
      if (navigation) {
        navigation.replace('Explore');
      } else {
        Alert.alert('Onboarding Action Success', \`Welcome, \${displayName}!\`);
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
                  <Text style={styles.phoneCountry}>\n                    +1\n                  </Text>
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
`;

export const EXPLORE_RN_CODE = `import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import SkeletonContent from 'react-native-skeleton-content';
// Store bindings for active room creations
import { useRoomStore } from '../stores/useRoomStore';
import { useAuthStore } from '../stores/useAuthStore';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  {
    id: 'movies',
    title: 'Movies',
    department: 'ENTERTAINMENT',
    emoji: '🎬',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB05gJg0JmvzPgYDmvNYIZX840qd29tt-iN71gkYbLV1h1pOSmc8N8WTFhQBTHGrERchJ-DMfVptsaYeBghf9l1MljQj4Qjh3Z3Q6LkMt5P9NRoC5ttXlHuK4qEaS86MT3hjD3VV4C0sePwBKmeiwSraZGSXPOetefAd1_NY0b4l_XEy0TcLq5G53CqAyEJJyS2Xn2kYg09TFCVjb4XBYuuv_tiUGhoPvlSNa472XZcNVfObx3OzcEGHswV8elQ_IvBXK7tUPFXrZU'
  },
  {
    id: 'restaurants',
    title: 'Restaurants',
    department: 'DINING',
    emoji: '🍕',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQgXLk1nXX74ZnFkAsUUCZNRHGdFOEY-DpLc08AJnCUOGxl1Rvfu4ijudmIVxD7VFJkk9hWucrWR_fQNGwhbdIkU5cMCql4y4jrVOE6yIqgJasx-6_gIslgjO_zSZY41FoGlTUygygZRsiq51th6T8odvE34lftFzxmys3z5h5epqPVH-Ta_80cz3kNi_r15IOgAcVRqzHGuzEyKELwgPRoPdVb49UKs9aReFksnMamAIlfFNFvZjUNEt9--oTwcTt3loZvvGtFos'
  },
  {
    id: 'activities',
    title: 'Activities',
    department: 'LIFESTYLE',
    emoji: '🎯',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiC-VZcFuGgMBJjYw6WS3FP6QRHOxHiVfYABcdOMMAqbPMaic2YPaPhexTdeSDlrD28wkHOE1yBnQIYwZP64mwiGlLHEMWVbc63gBO4ZFmHd4FK-Y5wRHTG2W0fFNGcAQaF2gLo1SSVYNXGe2QBpC2cYV8MNaXjC2yFQGKoF85u5F5SuMl6AMnYWvDTihqPdKHmeBo8VHJj3kPH0mzxyQGfkyAIzFJv1u1_61p6ETjAXI4oMRZ7ptjizS-j7u_uuZrzB5a0uB-2Vw'
  }
];

export default function ExploreScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('movies');
  const [roomCode, setRoomCode] = useState('');
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Proactive user profile fetching from auth
  const user = useAuthStore((state: any) => state?.user) || { name: 'Alex' };
  const createRoom = useRoomStore((state: any) => state?.createRoom || null);

  // Simulate fetching room categories on mount
  useEffect(() => {
    setIsCategoriesLoading(true);
    const timer = setTimeout(() => {
      setIsCategoriesLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshCategories = () => {
    setIsCategoriesLoading(true);
    setTimeout(() => {
      setIsCategoriesLoading(false);
    }, 1200);
  };

  const handleCreateRoom = () => {
    if (!selectedCategory) {
      Alert.alert('Selection Required', 'Please select a swiping category first.');
      return;
    }
    
    // Simulate room creation inside room stores
    if (createRoom) {
      createRoom(selectedCategory);
    }
    
    Alert.alert('Room Created', \`New room created under "\${selectedCategory}". Code: #7721\`, [
      { text: 'Launch Deck', onPress: () => navigation?.navigate('SwipeDeck') }
    ]);
  };

  const handleJoinRoom = () => {
    if (!roomCode) {
      Alert.alert('Error', 'Please enter a 4-digit room code.');
      return;
    }
    // Navigate straight to Swipe Deck representing successful entry
    navigation?.navigate('SwipeDeck');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Absolute Header Navigation */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>Hi, {user.name || 'Alex'}!</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.avatarBorder}>
            <Image
              style={styles.avatarImage}
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBiyE6B-JvjpCM4Tps5rNPl9aLbWKBIDLQt-27jLni3qb5kW3yey2EgbzkLRmQTTT5FIfJ1NIu6cGOATcOgHt_twJ-1B0a5wpC0_Uzu0hxoUVGnDzNnfaBy-UR8MrrdZefmYr1Euw4m5YN1VzQVdVMrog0QnqEvEMlvBv8-jyM3BCNHh5K9q31FKrKWSrddCP4Ru3DJSgoRDWgNuzyjNVryERScrUJmMGmj6sgahgwsmQUs2cus22GPsFTfU8hrICLcOwD_XX1VMY' }}
              contentFit="cover"
            />
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation?.navigate('Profile')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Block */}
        <View style={styles.headlineBlock}>
          <View style={styles.headlineRow}>
            <Text style={styles.mainTitle}>What are we{"\n"}deciding?</Text>
            <TouchableOpacity 
              style={styles.refreshBadge} 
              activeOpacity={0.7}
              onPress={handleRefreshCategories}
            >
              <Text style={styles.refreshBadgeText}>🔄 Refetch</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtext}>Choose a category to start your room.</Text>
        </View>

        {/* Categories Horizontal Carousel with react-native-skeleton-content */}
        {isCategoriesLoading ? (
          <SkeletonContent
            containerStyle={styles.skeletonCarousel}
            isLoading={true}
            boneColor="#171724"
            highlightColor="#232335"
            layout={[
              { key: 's1', width: 240, height: 360, borderRadius: 20, marginRight: 16 },
              { key: 's2', width: 240, height: 360, borderRadius: 20, marginRight: 16 },
              { key: 's3', width: 240, height: 360, borderRadius: 20 }
            ]}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardCarousel}
            contentContainerStyle={styles.carouselContainer}
          >
            {CATEGORIES.map((item) => {
              const isSelected = selectedCategory === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[
                    styles.categoryCard,
                    isSelected && styles.categoryCardActive,
                  ]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Image
                    style={styles.cardBg}
                    source={{ uri: item.image }}
                    contentFit="cover"
                  />
                  
                  {/* Gradient Overlay for bottom text styling */}
                  <View style={styles.cardGradient} />

                  {/* Selection Checkmark */}
                  {isSelected && (
                    <View style={styles.checkIndicator}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}

                  <View style={styles.cardMeta}>
                    <Text style={styles.categoryDept}>{item.department}</Text>
                    <Text style={styles.categoryTitle}>{item.emoji} {item.title}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* CTA Launch Section */}
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={handleCreateRoom}
        >
          <Text style={styles.ctaButtonText}>Create Room</Text>
          <Text style={styles.ctaButtonIcon}>➔</Text>
        </TouchableOpacity>

        {/* Subtle Fade Separator Divider */}
        <View style={styles.gradientDivider} />

        {/* Join Screen Form Action */}
        <View style={styles.joinForm}>
          <Text style={styles.sectionHeader}>OR JOIN A FRIEND'S ROOM</Text>
          
          <View style={styles.inputFormRow}>
            <TextInput
              style={styles.joinInput}
              placeholder="Enter Room ID (e.g. #7721)"
              placeholderTextColor="rgba(149, 141, 161, 0.4)"
              autoCapitalize="none"
              keyboardType="numbers-and-punctuation"
              value={roomCode}
              onChangeText={setRoomCode}
            />
            <TouchableOpacity 
              style={styles.joinButton}
              activeOpacity={0.8}
              onPress={handleJoinRoom}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Rejoin Suggestion Card */}
        <View style={styles.rejoinCard}>
          <View style={styles.rejoinLeft}>
            <View style={styles.historyCircle}>
              <Text style={styles.historyEmoji}>⏳</Text>
            </View>
            <Text style={styles.rejoinText}>Recent: "Friday Dinner"</Text>
          </View>
          <TouchableOpacity onPress={() => navigation?.navigate('SwipeDeck')}>
            <Text style={styles.rejoinLink}>Rejoin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131318',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(19, 19, 24, 0.8)',
    borderBottomWidth: 1,
    borderColor: 'rgba(31, 31, 53, 0.2)',
  },
  headerLeft: {
    justifyContent: 'center',
  },
  greetingText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    color: '#e4e1e9',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(210, 187, 255, 0.2)',
    overflow: 'hidden',
    backgroundColor: '#1f1f25',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  settingsButton: {
    marginLeft: 16,
    padding: 4,
  },
  settingsIcon: {
    fontSize: 22,
    color: '#ccc3d8',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headlineBlock: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  headlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  refreshBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    marginBottom: 12,
  },
  refreshBadgeText: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#d2bbff',
  },
  skeletonCarousel: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  mainTitle: {
    fontFamily: 'System',
    fontSize: 52,
    fontWeight: '800',
    color: '#d2bbff',
    letterSpacing: -1.5,
    lineHeight: 56,
  },
  subtext: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc3d8',
    marginTop: 8,
  },
  cardCarousel: {
    marginVertical: 12,
  },
  carouselContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  categoryCard: {
    width: 240,
    height: 360,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f1f35',
    backgroundColor: 'rgba(17, 17, 24, 0.7)',
  },
  categoryCardActive: {
    borderColor: '#d2bbff',
    borderWidth: 2,
  },
  cardBg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(17, 17, 24, 0.85)',
  },
  checkIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d2bbff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontFamily: 'System',
    color: '#3f008e',
    fontWeight: '800',
    fontSize: 16,
  },
  cardMeta: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  categoryDept: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#4edea3',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  categoryTitle: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '700',
    color: '#e4e1e9',
  },
  ctaButton: {
    marginHorizontal: 24,
    marginTop: 24,
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaButtonText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    color: '#ede0ff',
    marginRight: 8,
  },
  ctaButtonIcon: {
    fontSize: 18,
    color: '#ede0ff',
  },
  gradientDivider: {
    height: 1,
    backgroundColor: '#1f1f35',
    opacity: 0.5,
    marginVertical: 32,
    marginHorizontal: 24,
  },
  joinForm: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#ccc3d8',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  inputFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#1b1b20',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#e4e1e9',
  },
  joinButton: {
    position: 'absolute',
    right: 12,
    height: 38,
    backgroundColor: '#2a292f',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#d2bbff',
  },
  rejoinCard: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: 'rgba(17, 17, 24, 0.7)',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rejoinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 165, 114, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyEmoji: {
    fontSize: 14,
  },
  rejoinText: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '400',
    color: '#e4e1e9',
  },
  rejoinLink: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    color: '#d2bbff',
  }
});
`;

export const SWIPE_DECK_RN_CODE = `import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function SwipeDeckScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const stack = [
    {
      id: 1,
      title: 'Inception',
      meta: '2010 • 8.8/10 • Sci-Fi/Action',
      badge: 'JOINED',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZDljBbckIYz-yGI67xPby-fuTn3WzvOKfYzbJLK3Be_XKWA5RhfJX4zMNM_j0ZKHKT1U5Jajuk9KFonc9L6x2QJG49kWkiVy1vydWNvgMnvCNaYdpmAX4R6aoi7b8E4bqzOO9JV3UX6UdrKPYCNtyjCLRGzYAaN8iZGXlHOrtlGX-l6vSb9pRZ9zHqLK07KHp5HVAuxEE6MRKnaED9n-InUqNkrYo8Ys4DFeMYbUOGAFKgxdv1TDwV-Kk-pt7rD_Dm6xTU7q3gTM',
      tags: ['🌀 Dreamy', '🧠 Smart']
    },
    {
      id: 2,
      title: 'Blade Runner 2049',
      meta: '2017 • 8.0/10 • Sci-Fi/Noir',
      badge: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYvYHgdtMjML9pgM-emHRaPMfN6nDSW3ZZcTZUei2agZdLDB_3dV-4qtcfXwx_f_S63TEh-5zUOMxkRRf-YbqqqxrSxsUIVgU2f4F8AxPdJZL1qpXbjMHVMZaTerRvlkNpuWfek8jhzIj7XvZ6AxQUZ9ODKel6YNdm2VZCVzlkW2owaqu8RXIP0aS-NWmPCru_RCSMKPDrKxA5GH3J9d1rUkTGjzxGRZeUKRit2NSZwjlyN5Y2Cm9e-B6T-Samv3iPmJCAjQt4lQM',
      tags: ['🌃 Neon', '🤖 Cyberpunk']
    }
  ];

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // Animation spring configurations for entrance/scaling of next cards
  const entranceScale = useSharedValue(0.9);
  const entranceOpacity = useSharedValue(0.85);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    translateX.value = 0;
    translateY.value = 0;
    entranceScale.value = 0.9;
    entranceOpacity.value = 0.85;

    if (direction === 'right') {
      navigation?.navigate('MatchCelebration');
    } else {
      if (currentIndex + 1 < stack.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(stack.length);
      }
    }
  };

  const forceSwipe = (direction: 'left' | 'right') => {
    const targetX = direction === 'right' ? width + 100 : -width - 100;
    
    // Smooth transition outwards
    translateX.value = withTiming(targetX, { duration: 250 }, () => {
      runOnJS(handleSwipeComplete)(direction);
    });
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      // Animate scale of incoming background cards proportionally
      entranceScale.value = interpolate(
        Math.abs(event.translationX),
        [0, SWIPE_THRESHOLD],
        [0.9, 1],
        Extrapolation.CLAMP
      );
      entranceOpacity.value = interpolate(
        Math.abs(event.translationX),
        [0, SWIPE_THRESHOLD],
        [0.85, 1],
        Extrapolation.CLAMP
      );
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(width + 100, { duration: 200 }, () => {
          runOnJS(handleSwipeComplete)('right');
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width - 100, { duration: 200 }, () => {
          runOnJS(handleSwipeComplete)('left');
        });
      } else {
        // Return back to native center using Reanimated Springs
        translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        entranceScale.value = withSpring(0.9, { damping: 15 });
        entranceOpacity.value = withSpring(0.85, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: rotate + 'deg' }
      ]
    };
  });

  const nextCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(entranceScale.value) }],
      opacity: withSpring(entranceOpacity.value)
    };
  });

  const likeOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const nopeOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD / 2, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Render top swiping card helper with gestures
  const renderCard = () => {
    if (currentIndex >= stack.length) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>You've seen everything!</Text>
          <Text style={styles.emptyDesc}>Waiting for others to finish their picks. We'll find a match soon!</Text>
        </View>
      );
    }

    const currentCard = stack[currentIndex];

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.swipeCard, animatedStyle]}>
          <View style={styles.cardCover}>
            <Image
              style={styles.cardImage}
              source={{ uri: currentCard.image }}
              contentFit="cover"
            />

            {/* Sweep overlays */}
            <Animated.View style={[styles.overlayLike, likeOpacityStyle]}>
              <Text style={styles.overlayTextLike}>LIKE</Text>
            </Animated.View>

            <Animated.View style={[styles.overlayNope, nopeOpacityStyle]}>
              <Text style={styles.overlayTextNope}>NOPE</Text>
            </Animated.View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>{currentCard.title}</Text>
              {currentCard.badge ? (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{currentCard.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.cardMeta}>{currentCard.meta}</Text>

            <View style={styles.tagGrid}>
              {currentCard.tags.map((tag, i) => (
                <View style={styles.tagChip} key={i}>
                  <Text style={styles.tagLabel}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Top Header App Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>UP</Text>
            </View>
            <Text style={styles.brandTitle}>ConsensuS</Text>
          </View>
          <TouchableOpacity onPress={() => navigation?.openDrawer()}>
            <Text style={styles.menuIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Swipe Deck Swipers */}
        <View style={styles.swipeLayout}>
          {/* Avatars on top */}
          <View style={styles.membersArea}>
            <View style={styles.avatarGroup}>
              <Image
                style={[styles.miniAvatar, { zIndex: 3 }]}
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvYsFYoXFm1Pa5arZQmaGFGn7J9z9NGzgqFDPlEc5jdsIqFdRtW2-NS1iN_N8ysw8CZSICQe4NqcSewd4G8IyAR064TeWjWOBdY9zLK3lToQemKgEhftvoDobJDJOv4m8zQcdHxEnfvwYOgaELPGHGrnXNgRlzuIZrNsq2lUEN9w0IpyEuSQt2xOdZaS7JmcS4ewsCpufp31gKu_pDVG97uxWEGFNIp_FDVLtHZKvkiVcmeG__ooQQVooGDeiadTLAd8-ES-fvxcs' }}
              />
              <Image
                style={[styles.miniAvatar, { marginLeft: -8, zIndex: 2 }]}
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5gZif1C_MGx-rC4RerRwjCkD7Yg4-ZWUaBw3h5Y7FBAhre989R7bXMsEf6RnU9a6PaJKRSgFDutOVTQP11h2e6kAv0H6X9rnUlftLYQWvkcVAbqGoAisvtTsKI-OryeuRYmx0NOLl7lVEn18yOvC4C3ZD9d1X-EZI4Ys9OxG87fCKR_3OJh2xGnX6JGLZ_0c2MzQ2k1jXtbecaZupnMYigOePG6pvuy__6Hvog9rKPCO7oORR8Exld4lf7_e08IVUvC02GTrYDdk' }}
              />
              <Image
                style={[styles.miniAvatar, { marginLeft: -8, zIndex: 1 }]}
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcV4NsZmqU9oFC43oJ_6Rfo4tEOo8uf4ED25HXSzBNgS5ejEw1soke7aFzcM0W1Deh81mzaFfg7d_jVHcLYl0y24XwPj-2mx7KR-T4pr4JfP5wGmss1D4L7QKNb-oYNptROiI6QsmcjXpAsf2E-6PtSzzaro37M23kb2d2LyvdM1XBmu3F3fQjErpUBoKbuzheP2ImAzwgwsODx7QC-3IR9JrPBn5P2dz2wj2aWQiB9C4X80gcpZ36gU7U9K4Uv2PrD14hRPmsAWc' }}
              />
              <View style={styles.plusAvatar}>
                <Text style={styles.plusText}>+2</Text>
              </View>
            </View>
            <Text style={styles.metaDescription}>4 FRIENDS SWIPING</Text>
          </View>

          <View style={styles.fadeDivider} />

          {/* Swipe Card Stack */}
          <View style={styles.stackArea}>
            {currentIndex + 1 < stack.length ? (
              <Animated.View style={[styles.swipeCard, { transform: [{ scale: 0.9 }, { translateY: 15 }], opacity: 0.8, position: 'absolute', inset: 0 }, nextCardStyle]}>
                <View style={styles.cardCover}>
                  <Image
                    style={styles.cardImage}
                    source={{ uri: stack[currentIndex + 1].image }}
                    contentFit="cover"
                  />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cardTitle}>{stack[currentIndex + 1].title}</Text>
                  </View>
                  <Text style={styles.cardMeta}>{stack[currentIndex + 1].meta}</Text>
                </View>
              </Animated.View>
            ) : null}
            {renderCard()}
          </View>

          {/* Button Controls */}
          {currentIndex < stack.length && (
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[styles.controlButton, styles.buttonNope]}
                activeOpacity={0.8}
                onPress={() => forceSwipe('left')}
              >
                <Text style={styles.ctrlSymbol}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.buttonLike]}
                activeOpacity={0.8}
                onPress={() => forceSwipe('right')}
              >
                <Text style={styles.ctrlSymbol}>♥</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131318',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(19, 19, 24, 0.8)',
    borderBottomWidth: 1,
    borderColor: 'rgba(31, 31, 53, 0.2)',
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
  menuIcon: {
    fontSize: 22,
    color: '#ccc3d8',
  },
  swipeLayout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  membersArea: {
    alignItems: 'center',
    marginTop: 16,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#131318',
  },
  plusAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1f1f25',
    borderWidth: 2,
    borderColor: '#131318',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  plusText: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '700',
    color: '#d2bbff',
  },
  metaDescription: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#ccc3d8',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  fadeDivider: {
    height: 1,
    width: width * 0.8,
    backgroundColor: '#1f1f35',
    opacity: 0.5,
    marginVertical: 12,
  },
  stackArea: {
    width: 320,
    height: 420,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeCard: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#111118',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f1f35',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  cardCover: {
    height: '60%',
    width: '100%',
    backgroundColor: '#1b1b20',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  overlayLike: {
    position: 'absolute',
    top: 24,
    left: 24,
    borderWidth: 4,
    borderColor: '#4edea3',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    transform: [{ rotate: '-12deg' }],
  },
  overlayTextLike: {
    color: '#4edea3',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  overlayNope: {
    position: 'absolute',
    top: 24,
    right: 24,
    borderWidth: 4,
    borderColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    transform: [{ rotate: '12deg' }],
  },
  overlayTextNope: {
    color: '#ef4444',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  cardBody: {
    height: '40%',
    backgroundColor: '#1b1b20',
    padding: 16,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    color: '#e4e1e9',
  },
  badgeContainer: {
    backgroundColor: 'rgba(78, 222, 163, 0.1)',
    borderColor: 'rgba(78, 222, 163, 0.2)',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  badgeText: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600',
    color: '#4edea3',
  },
  cardMeta: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#ccc3d8',
  },
  tagGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#35343a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  tagLabel: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600',
    color: '#e4e1e9',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    color: '#d2bbff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDesc: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#ccc3d8',
    textAlign: 'center',
    lineHeight: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111118',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNope: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    shadowColor: '#ef4444',
  },
  buttonLike: {
    borderColor: '#4edea3',
    shadowColor: '#4edea3',
  },
  ctrlSymbol: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  }
});
`;

export const MATCH_RN_CODE = `import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
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
`;

export const PROFILE_RN_CODE = `import React, { useState } from 'react';
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
`;

export const APP_RN_CODE = `import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import SwipeDeckScreen from './src/screens/SwipeDeckScreen';
import MatchCelebrationScreen from './src/screens/MatchCelebrationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type ScreenName = 'Onboarding' | 'Explore' | 'SwipeDeck' | 'MatchCelebration' | 'Profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Onboarding');
  const [navigationHistory, setNavigationHistory] = useState<ScreenName[]>(['Onboarding']);

  // Custom high fidelity navigation simulator
  const navigation = {
    navigate: (screen: ScreenName) => {
      setCurrentScreen(screen);
      setNavigationHistory((prev) => [...prev, screen]);
    },
    replace: (screen: ScreenName) => {
      setCurrentScreen(screen);
      setNavigationHistory([screen]);
    },
    goBack: () => {
      if (navigationHistory.length > 1) {
        const nextHistory = [...navigationHistory];
        nextHistory.pop(); // Remove active
        const previous = nextHistory[nextHistory.length - 1];
        setNavigationHistory(nextHistory);
        setCurrentScreen(previous);
      } else {
        setCurrentScreen('Onboarding');
      }
    },
    openDrawer: () => {
      // Direct user straight to Profile setting drawer!
      setCurrentScreen('Profile');
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'Onboarding':
        return <OnboardingScreen navigation={navigation} />;
      case 'Explore':
        return <ExploreScreen navigation={navigation} />;
      case 'SwipeDeck':
        return <SwipeDeckScreen navigation={navigation} />;
      case 'MatchCelebration':
        return <MatchCelebrationScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      default:
        return <OnboardingScreen navigation={navigation} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.appContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
        {renderActiveScreen()}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
});
`;

export const AUTH_STORE_CODE = `import { create } from 'zustand';

interface User {
  phone: string;
  name: string;
  handle: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (payload: { token?: string; user: Partial<User> } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: 'mock-session-jwt-10924',
  user: {
    phone: '+1 (555) 012-3456',
    name: 'Jordan D.',
    email: 'jordan.d@example.com',
    handle: '@jordan_consensus',
  },
  setAuth: (payload) => set((state) => {
    if (!payload) return { token: null, user: null };
    return {
      token: payload.token !== undefined ? payload.token : state.token,
      user: payload.user ? { ...state.user, ...payload.user } as User : state.user,
    };
  }),
}));
`;

export const ROOM_STORE_CODE = `import { create } from 'zustand';

interface RoomState {
  activeRoomId: string | null;
  activeCategory: string | null;
  create: (category: string) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  activeRoomId: null,
  activeCategory: null,
  create: (category) => set({ activeRoomId: 'room_7721', activeCategory: category }),
  reset: () => set({ activeRoomId: null, activeCategory: null }),
}));
`;

export const PACKAGE_JSON_CODE = `{
  "name": "consensus-mobile",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.11.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-reanimated": "~3.10.1",
    "expo-image": "~1.12.12",
    "react-native-skeleton-content": "^1.0.2",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "typescript": "~5.3.3"
  },
  "private": true
}
`;
