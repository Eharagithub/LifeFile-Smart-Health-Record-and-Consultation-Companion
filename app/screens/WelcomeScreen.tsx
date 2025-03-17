import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#6B4EAE', // Deep purple
  secondary: '#8A6FD0', // Medium purple
  accent: '#A594E0', // Light purple
  background: '#F5F3FF', // Very light purple
  text: '#2D1B69', // Dark purple
  white: '#FFFFFF',
  gray: '#6B7280',
};

interface WalkthroughItem {
  id: string;
  image: any;
  title: string;
  description: string;
}

const walkthroughData: WalkthroughItem[] = [
  {
    id: '1',
    image: require('../../assets/images/walk-1.jpg'),
    title: 'Connect With Caregivers',
    description: 'Share your health information securely with your doctors and loved ones',
  },
  {
    id: '2',
    image: require('../../assets/images/walk-2.jpg'),
    title: 'Track Your Health',
    description: 'Monitor and manage your health records in one secure place',
  },
  {
    id: '3',
    image: require('../../assets/images/walk-3.jpg'),
    title: 'Secure & Private',
    description: 'Your health data is encrypted and protected with the highest security standards',
  },
];

export function WelcomeScreen() {
  const router = useRouter();
  const [showFullContent, setShowFullContent] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const logoScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const scrollX = useSharedValue(0);

  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    const animationTimeout = Platform.OS === 'web' ? 3000 : 5000;
    
    setTimeout(() => {
      logoScale.value = withSpring(0.8);
      contentOpacity.value = withTiming(1, { duration: 1000 });
      setShowFullContent(true);
    }, animationTimeout);

    // Auto-scroll walkthrough
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextSlide = (currentSlide + 1) % walkthroughData.length;
        scrollViewRef.current.scrollTo({
          x: nextSlide * width,
          animated: true,
        });
        setCurrentSlide(nextSlide);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [currentSlide]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleLogin = () => {
    if (Platform.OS === 'web') {
      router.push({ pathname: '/(auth)/login' });
    } else {
      router.push('/(auth)/login' as any);
    }
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/signup' as any);
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(offset / slideSize);
    scrollX.value = offset;
    
    if (currentSlide !== currentIndex) {
      setCurrentSlide(currentIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundOverlay} />
      
      <TouchableOpacity style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logoWrapper}>
          <View>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.heartIcon}
              resizeMode="contain"
            />
          </View>
          
        </View>
      </Animated.View>

      {showFullContent && (
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          <View style={styles.walkthroughContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={width}
              snapToAlignment="center"
            >
              {walkthroughData.map((item, index) => (
                <View 
                  key={item.id} 
                  style={styles.slide}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={item.image}
                      style={styles.walkthroughImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.slideTitle}>{item.title}</Text>
                  <Text style={styles.slideDescription}>
                    {item.description}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.pagination}>
              {walkthroughData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentSlide === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login to Your Account!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={handleCreateAccount}
            >
              <Text style={styles.createAccountButtonText}>Create New Account</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms</Text> &{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: COLORS.background,
    opacity: 0.9,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: height * 0.6,
    left: 0,
    right: 0,
    height: height * 0.8,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    bottom: height * 0.4,
  },
  logoWrapper: {
    alignItems: 'center',
  },

  heartIcon: {
    width: 460,
    height: 460,
    marginBottom: 10,
    tintColor: COLORS.primary,
  },
 
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  walkthroughContainer: {
    height: height * 0.45,
    alignItems: 'center',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.85,
    height: height * 0.3,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walkthroughImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.gray,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    opacity: 1,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  createAccountButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 12,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  phoneFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
    borderWidth: 12,
    borderColor: '#E1E8ED',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
}); 