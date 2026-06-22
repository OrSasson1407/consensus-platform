import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  SafeAreaView
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore, useRoomStore } from '../store/roomStore';
import { api } from '../services/api';
import { useRoomSocket } from '../hooks/useRoomSocket';
import { ContentItem, MatchedItem } from '../types';

type RoutePropType = RouteProp<RootStackParamList, 'SwipeDeck'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'SwipeDeck'>;

const PLACEHOLDER_IMAGES: Record<string, string> = {
  MOVIES: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80',
  RESTAURANTS: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  ACTIVITIES: 'https://images.unsplash.com/photo-1472653425572-cf5df2e43775?w=400&q=80',
};

export default function SwipeDeckScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  
  const { roomId, categoryType } = route.params;
  const user = useAuthStore((state) => state.user);

  const { 
    contentItems, 
    setContent, 
    members, 
    setMembers, 
    setMatch 
  } = useRoomStore();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cardsSwiped, setCardsSwiped] = useState(0);

  const swiperRef = useRef<Swiper<ContentItem>>(null);

  // 1. Fetch initial content and active room members
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const items = await api.getRoomContent(roomId);
        const activeMembers = await api.getMembers(roomId);
        if (active) {
          setContent(items);
          setMembers(activeMembers);
        }
      } catch (err: any) {
        if (active) {
          setErrorMsg(err.message || 'Failed to fetch swipe deck parameters.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { active = false; };
  }, [roomId, setContent, setMembers]);

  // 2. Setup WebSocket listeners
  const onMatchCelebration = (matchedItem: MatchedItem) => {
    setMatch(matchedItem);
    navigation.navigate('Match', { matchedItem });
  };

  const { sendSwipe } = useRoomSocket(roomId, user?.id || '', onMatchCelebration);

  const handleSwipeRight = async (cardIndex: number) => {
    const item = contentItems[cardIndex];
    if (!item) return;

    try {
      // Send optimistic REST Swipe
      const res = await api.swipe(roomId, { content_item_id: item.id, swipe_status: 'LIKE' });
      
      // Emit WebSocket state change so users update
      sendSwipe(item.id, 'LIKE');

      if (res.isMatch) {
        onMatchCelebration({
          id: item.id,
          title: item.title,
          image_url: item.image_url,
        });
      }
    } catch (err) {
      console.warn('Network error recording LIKE swipe:', err);
    }
  };

  const handleSwipeLeft = async (cardIndex: number) => {
    const item = contentItems[cardIndex];
    if (!item) return;

    try {
      // Dislike swipes are internal, no WS update needed
      await api.swipe(roomId, { content_item_id: item.id, swipe_status: 'DISLIKE' });
    } catch (err) {
      console.warn('Network error recording DISLIKE swipe:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Fetching deck items...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.navigate('RoomCreate')}
        >
          <Text style={styles.retryText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const finishedAllCards = cardsSwiped >= contentItems.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Banner / Members list */}
      <View style={styles.header}>
        <View>
          <Text style={styles.roomLabel}>Lobby ID</Text>
          <Text style={styles.roomValue} numberOfLines={1}>{roomId.slice(0, 8)}...</Text>
        </View>
        <View style={styles.membersRow}>
          {members.map((mbr) => (
            <View key={mbr.id} style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>
                {mbr.display_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ))}
          <Text style={styles.membersCount}>{members.length} Active</Text>
        </View>
      </View>

      {/* Swipe Deck */}
      <View style={styles.deckContainer}>
        {!finishedAllCards && contentItems.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={contentItems}
            renderCard={(card) => {
              if (!card) return null;
              
              const imgUri = card.image_url || PLACEHOLDER_IMAGES[categoryType] || PLACEHOLDER_IMAGES.MOVIES;
              
              // Extract items meta
              const metaYear = card.meta_data?.year || card.meta_data?.rating || '';
              const metaDetail = card.meta_data?.cuisine || card.meta_data?.price_range || '';

              return (
                <View style={styles.card}>
                  <Image source={{ uri: imgUri }} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <View style={styles.metaRow}>
                      {!!metaYear && <Text style={styles.badgeMeta}>{String(metaYear)}</Text>}
                      {!!metaDetail && <Text style={styles.badgeMetaDetail}>{String(metaDetail)}</Text>}
                    </View>
                  </View>
                </View>
              );
            }}
            onSwipedLeft={(idx) => {
              handleSwipeLeft(idx);
              setCardsSwiped(idx + 1);
            }}
            onSwipedRight={(idx) => {
              handleSwipeRight(idx);
              setCardsSwiped(idx + 1);
            }}
            onSwipedAll={() => {
              setCardsSwiped(contentItems.length);
            }}
            cardIndex={cardsSwiped}
            backgroundColor={'transparent'}
            stackSize={3}
            stackScale={4}
            stackSeparation={14}
            disableBottomSwipe
            disableTopSwipe
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: '#ef4444',
                    borderColor: '#ef4444',
                    color: '#ffffff',
                    borderWidth: 1,
                    fontSize: 24,
                    fontWeight: '900',
                    borderRadius: 8,
                    overflow: 'hidden',
                    padding: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    marginRight: -20,
                  }
                }
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    color: '#ffffff',
                    borderWidth: 1,
                    fontSize: 24,
                    fontWeight: '900',
                    borderRadius: 8,
                    overflow: 'hidden',
                    padding: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    marginLeft: 20,
                  }
                }
              }
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💤</Text>
            <Text style={styles.emptyTitle}>Deck Finished!</Text>
            <Text style={styles.emptyDesc}>
              You've swiped all matching choices. We are active, waiting for other group members to finish swiping!
            </Text>
            <ActivityIndicator size="small" color="#7c3aed" style={{ marginTop: 20 }} />
          </View>
        )}
      </View>

      {/* Button fallback controls */}
      {!finishedAllCards && (
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.controlLeft]} 
            onPress={() => swiperRef.current?.swipeLeft()}
          >
            <Text style={styles.controlLabelText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlButton, styles.controlRight]} 
            onPress={() => swiperRef.current?.swipeRight()}
          >
            <Text style={styles.controlLabelText}>❤️</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  centerBox: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f35',
  },
  roomLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  roomValue: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: 'bold',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  membersCount: {
    fontSize: 11,
    color: '#9ca3af',
    marginLeft: 4,
  },
  deckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  card: {
    flex: 0.70,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f1f35',
    backgroundColor: '#111118',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '60%',
  },
  cardBody: {
    padding: 18,
    height: '40%',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f9fafb',
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badgeMeta: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    color: '#a78bfa',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeMetaDetail: {
    backgroundColor: '#1f1f35',
    color: '#d1d5db',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  controlLeft: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  controlRight: {
    backgroundColor: '#7c3aed',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  controlLabelText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f9fafb',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1f1f35',
    padding: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
