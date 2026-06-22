import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  Platform,
  SafeAreaView
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useRoomStore } from '../store/roomStore';

type RoutePropType = RouteProp<RootStackParamList, 'Match'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'Match'>;

export default function MatchScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  
  const { matchedItem } = route.params;
  const resetRoom = useRoomStore((state) => state.resetRoom);

  const handleOpenLink = () => {
    if (matchedItem.action_link) {
      Linking.openURL(matchedItem.action_link).catch((err) => {
        console.warn('Could not launch action url:', err);
      });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏁 We have a ConsensuS Match! We all agreed on: ${matchedItem.title}!`,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  const handleStartNew = () => {
    resetRoom();
    navigation.popToTop();
    navigation.navigate('RoomCreate');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti Animation Core */}
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        fallSpeed={3000}
        fadeOut={true}
      />

      {/* Share header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MATCH CELEBRATION</Text>
        <TouchableOpacity style={styles.shareBadge} onPress={handleShare}>
          <Text style={styles.shareBadgeText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.matchContent}>
        <Text style={styles.matchAlertLabel}>🎉 YOU ALL AGREED! 🎉</Text>
        <Text style={styles.matchAlertTitle}>It's a Match!</Text>

        <View style={styles.artworkContainer}>
          <View style={styles.goldenHalo} />
          {matchedItem.image_url ? (
            <Image 
              source={{ uri: matchedItem.image_url }} 
              style={styles.matchedImage} 
              resizeMode="cover" 
            />
          ) : (
            <View style={[styles.matchedImage, styles.placeholderMatchBox]}>
              <Text style={styles.placeholderEmoji}>🍿</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemTitle}>{matchedItem.title}</Text>
        <Text style={styles.celebrationSub}>Everyone in your room swiped RIGHT on this item!</Text>

        <View style={styles.actionButtonsContainer}>
          {!!matchedItem.action_link && (
            <TouchableOpacity style={styles.buttonAction} onPress={handleOpenLink}>
              <Text style={styles.buttonActionText}>Let's Go / Book Now</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.buttonNewLobby} onPress={handleStartNew}>
            <Text style={styles.buttonNewLobbyText}>Start New Room</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
  },
  shareBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shareBadgeText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '700',
  },
  matchContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: -20,
  },
  matchAlertLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 3,
    marginBottom: 8,
  },
  matchAlertTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: 24,
  },
  artworkContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldenHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#fbbf24',
    opacity: 0.15,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  matchedImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: '#fbbf24',
  },
  placeholderMatchBox: {
    backgroundColor: '#111118',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 60,
  },
  itemTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  celebrationSub: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
    marginBottom: 40,
  },
  actionButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  buttonAction: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonActionText: {
    color: '#0a0a0f',
    fontSize: 15,
    fontWeight: '800',
  },
  buttonNewLobby: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonNewLobbyText: {
    color: '#e5e7eb',
    fontSize: 15,
    fontWeight: '700',
  }
});
