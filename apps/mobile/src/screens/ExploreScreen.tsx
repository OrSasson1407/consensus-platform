import React, { useState, useEffect } from 'react';
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
    
    Alert.alert('Room Created', `New room created under "${selectedCategory}". Code: #7721`, [
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
            <Text style={styles.mainTitle}>{"What are we\ndeciding?"}</Text>
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
