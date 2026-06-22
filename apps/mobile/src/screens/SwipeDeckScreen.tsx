import React, { useState } from 'react';
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
