import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Share,
  Clipboard,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore, useRoomStore } from '../store/roomStore';
import { api } from '../services/api';
import { CategoryType } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'RoomCreate'>;

const CATEGORIES = [
  { type: 'MOVIES' as CategoryType, label: 'Movies', emoji: '🎬', desc: 'Pick films to watch' },
  { type: 'RESTAURANTS' as CategoryType, label: 'Restaurants', emoji: '🍕', desc: 'Decide where to eat' },
  { type: 'ACTIVITIES' as CategoryType, label: 'Activities', emoji: '🎯', desc: 'Formulate plans together' },
];

export default function RoomCreateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);
  
  const { setRoom, resetRoom } = useRoomStore();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('MOVIES');
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState('');
  
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setErrorMsg(null);
    setCreating(true);
    resetRoom();

    try {
      const room = await api.createRoom({ category_type: selectedCategory });
      setRoom(room);
      setCreatedRoomId(room.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not create room.');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (roomIdToJoin?: string) => {
    const targetRoomId = roomIdToJoin || joinRoomId.trim();
    if (!targetRoomId) {
      setErrorMsg('Please enter a Room ID');
      return;
    }

    setErrorMsg(null);
    setJoining(true);

    try {
      const room = await api.joinRoom(targetRoomId);
      setRoom(room);
      navigation.navigate('SwipeDeck', { roomId: room.id, categoryType: room.category_type });
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not join room. Double-check the ID.');
    } finally {
      setJoining(false);
    }
  };

  const copyRoomIdToClipboard = () => {
    if (createdRoomId) {
      Clipboard.setString(createdRoomId);
      Alert.alert('Copied!', 'Room ID copied to your clipboard. Send it to your friends!');
    }
  };

  const shareRoomId = async () => {
    if (createdRoomId) {
      try {
        await Share.share({
          message: `Join my ConsensuS session to swipe on ${selectedCategory.toLowerCase()}! Room ID: ${createdRoomId}`,
        });
      } catch (error) {
        console.warn('Sharing failed:', error);
      }
    }
  };

  const initials = user?.display_name ? user.display_name.charAt(0).toUpperCase() : 'U';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* User Header */}
      <View style={styles.userBar}>
        <View>
          <Text style={styles.greetText}>WelcOMe,</Text>
          <Text style={styles.userNameText}>{user?.display_name || 'Friend'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatarCircle} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Category selector */}
      {!createdRoomId ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>1. Choose Category</Text>
          <Text style={styles.sectionSub}>What decision is your group trying to make?</Text>

          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.type;
              return (
                <TouchableOpacity
                  key={cat.type}
                  style={[styles.categoryCard, active && styles.categoryCardActive]}
                  onPress={() => setSelectedCategory(cat.type)}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  <Text style={styles.categoryDesc}>{cat.desc}</Text>
                  {active && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={handleCreateRoom}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Lobby</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.sectionCard, styles.createdRoomCard]}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.sectionHeaderCentered}>Lobby Active!</Text>
          <Text style={styles.sectionSubCentered}>Share this code with your friends to swipe together:</Text>

          <TouchableOpacity style={styles.idDisplayBox} onPress={copyRoomIdToClipboard}>
            <Text style={styles.roomIdValue} numberOfLines={1}>{createdRoomId}</Text>
            <Text style={styles.idTapLabel}>Tap to Copy</Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.buttonOutline} onPress={shareRoomId}>
              <Text style={styles.buttonTextOutline}>Share Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.buttonPrimaryFilled} 
              onPress={() => handleJoinRoom(createdRoomId)}
            >
              <Text style={styles.buttonText}>Start Swiping</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.cancelLink} 
            onPress={() => setCreatedRoomId(null)}
          >
            <Text style={styles.cancelLinkLabelText}>Reset & Make Another</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.dividerText}>or join existing</Text>

      {/* Join Box */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Join Friend's Room</Text>
        <Text style={styles.sectionSub}>Got an invite code? Paste it below to participate:</Text>

        <TextInput
          style={styles.roomIdInput}
          placeholder="Paste Room ID here..."
          placeholderTextColor="#4b5563"
          autoCapitalize="none"
          autoCorrect={false}
          value={joinRoomId}
          onChangeText={setJoinRoomId}
        />

        <TouchableOpacity 
          style={styles.buttonSecondary} 
          onPress={() => handleJoinRoom()}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Join Session</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f3f4f6',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#111118',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f1f35',
    padding: 20,
    marginBottom: 20,
  },
  createdRoomCard: {
    borderColor: '#7c3aed',
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  sectionHeaderCentered: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f9fafb',
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionSub: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 16,
  },
  sectionSubCentered: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryCardActive: {
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  categoryEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 12,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#7c3aed',
  },
  buttonPrimary: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonPrimaryFilled: {
    flex: 1,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#1f1f35',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerText: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginVertical: 14,
  },
  roomIdInput: {
    backgroundColor: '#0a0a0f',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 12,
    color: '#f9fafb',
    padding: 14,
    fontSize: 14,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  idDisplayBox: {
    backgroundColor: '#0a0a0f',
    borderWidth: 1,
    borderColor: '#1f1f35',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  roomIdValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fbbf24',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  idTapLabel: {
    fontSize: 10,
    color: '#7c3aed',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: 6,
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  buttonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#111118',
  },
  buttonTextOutline: {
    color: '#d1d5db',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelLink: {
    marginTop: 16,
  },
  cancelLinkLabelText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
