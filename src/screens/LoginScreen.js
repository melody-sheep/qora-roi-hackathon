import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { authService } from '../services/auth';

const { width, height } = Dimensions.get('window');

// Particle Component for animated background
const Particle = ({ size, duration, delay, startX, startY }) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;
  const opacity = useRef(new Animated.Value(0.8)).current; // CHANGED: Increased from 0.3 to 0.8

  useEffect(() => {
    const animateParticle = () => {
      // Reset to start position
      translateX.setValue(startX);
      translateY.setValue(startY);
      opacity.setValue(0.8); // CHANGED: Increased from 0.3 to 0.8

      // Create random movement
      const randomX = startX + (Math.random() * 80 - 40);
      const randomY = startY + (Math.random() * 80 - 40);

      const moveX = Animated.timing(translateX, {
        toValue: randomX,
        duration: duration,
        useNativeDriver: true,
        delay: delay,
      });

      const moveY = Animated.timing(translateY, {
        toValue: randomY,
        duration: duration,
        useNativeDriver: true,
        delay: delay,
      });

      const fadeInOut = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1.0, // CHANGED: Increased from 0.7 to 1.0 (fully opaque)
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8, // CHANGED: Increased from 0.3 to 0.8
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]);

      Animated.parallel([moveX, moveY, fadeInOut]).start(() => {
        setTimeout(() => {
          animateParticle();
        }, 500);
      });
    };

    const startDelay = setTimeout(() => {
      animateParticle();
    }, delay);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // CHANGED: Increased from 0.6 to 0.9
          position: 'absolute',
          left: 0,
          top: 0,
          transform: [{ translateX }, { translateY }],
          opacity: opacity,
        },
      ]}
    />
  );
};

const ParticleBackground = () => {
  const particles = Array.from({ length: 25 }).map((_, index) => { // CHANGED: Increased from 20 to 25 particles
    const size = 4 + Math.random() * 8; // CHANGED: Increased from 3-9px to 4-12px
    const duration = 3000 + Math.random() * 3000; // CHANGED: Faster movement
    const delay = Math.random() * 1000; // CHANGED: Shorter delay
    const startX = Math.random() * width;
    const startY = 50 + Math.random() * 250;

    return (
      <Particle
        key={index}
        size={size}
        duration={duration}
        delay={delay}
        startX={startX}
        startY={startY}
      />
    );
  });

  return <View style={styles.particleContainer}>{particles}</View>;
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const result = await authService.login(email, password);
    
    setLoading(false);
    
    if (result.success) {
      // Fetch and store user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name, email, role')
        .eq('email', email)
        .single();

      if (!userError && userData) {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify({
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role
        }));
      }

      Alert.alert(
        '✅ Success!',
        'Logged in successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (result.user.role === 'doctor') {
                navigation.navigate('ClinicMain');
              } else {
                navigation.navigate('StudentDashboard');
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('❌ Login Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Decorative Background Elements */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />
      
      {/* Particle Background - MOVED TO BACKGROUND */}
      <ParticleBackground />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/qora_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to access your healthcare dashboard
            </Text>
          </View>

          {/* Login Form - Full width with rounded top only */}
          <View style={styles.formWrapper}>
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Sign In</Text>
                <Text style={styles.formSubtitle}>
                  Enter your credentials to continue
                </Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputSection}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="mail-outline" size={18} color="#6B7280" />
                  <Text style={styles.inputLabel}>Email Address</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.inputFieldTouchable,
                    emailFocused && styles.inputFieldFocused
                  ]}
                  activeOpacity={1}
                  onPress={() => {
                    // Focus the TextInput using ref
                    if (emailInputRef.current) emailInputRef.current.focus();
                  }}
                >
                  <TextInput
                    ref={emailInputRef}
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onFocus={() => {
                      setEmailFocused(true);
                      setPasswordFocused(false);
                    }}
                    onBlur={() => setEmailFocused(false)}
                  />
                </TouchableOpacity>
              </View>

              {/* Password Input */}
              <View style={styles.inputSection}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
                  <Text style={styles.inputLabel}>Password</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.inputFieldTouchable,
                    passwordFocused && styles.inputFieldFocused
                  ]}
                  activeOpacity={1}
                  onPress={() => {
                    // Focus the TextInput using ref
                    if (passwordInputRef.current) passwordInputRef.current.focus();
                  }}
                >
                  <View style={styles.passwordInputWrapper}>
                    <TextInput
                      ref={passwordInputRef}
                      style={styles.passwordInput}
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={secureText}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      onFocus={() => {
                        setEmailFocused(false);
                        setPasswordFocused(true);
                      }}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setSecureText(!secureText)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons 
                        name={secureText ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color="#6B7280" 
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => Alert.alert('Forgot Password', 'Feature coming soon')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.signInButton, (!email || !password || loading) && styles.signInButtonDisabled]}
                onPress={handleLogin}
                disabled={!email || !password || loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Register')}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.registerLink}> Sign up now</Text>
                </TouchableOpacity>
              </View>

              {/* Footer Inside White Form */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>© 2026 QORA Healthcare. All rights reserved.</Text>
                <View style={styles.footerLinks}>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Terms', 'Terms of service')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.footerLink}>Terms</Text>
                  </TouchableOpacity>
                  <Text style={styles.footerSeparator}>•</Text>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Privacy', 'Privacy policy')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.footerLink}>Privacy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    zIndex: 0,
    pointerEvents: 'none', // Crucial: prevents particles from blocking touches
  },
  particle: {
    position: 'absolute',
  },
  topCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: 0,
  },
  bottomCircle: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    zIndex: 0,
  },
  keyboardView: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // More transparent to show particles
    paddingHorizontal: 24,
    zIndex: 5,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    zIndex: 6,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    zIndex: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    zIndex: 6,
  },
  formWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  formCard: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    zIndex: 10,
  },
  formHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inputFieldTouchable: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 50,
    justifyContent: 'center',
  },
  inputFieldFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
    height: 26,
    width: '100%',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
    height: 26,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
    marginTop: 0,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLink: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerSeparator: {
    fontSize: 12,
    color: '#6B7280',
  },
});