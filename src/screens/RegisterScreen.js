import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import ParticlesBackground from '../components/ParticlesBackground';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade animation for logo
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              console.log('Registration demo');
              navigation.navigate('Login');
            }
          }
        ]
      );
      console.log('Registration attempt:', { fullName, email, password });
    }, 1500);
  };

  const isFormValid = fullName.trim() !== '' && 
                     email.trim() !== '' && 
                     password.trim() !== '' && 
                     confirmPassword.trim() !== '' && 
                     password === confirmPassword;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ParticlesBackground />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.content}>
            {/* Logo Section with Fade Animation */}
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
              <Image
                source={require('../../assets/qora_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Animatable.Text 
                animation="fadeIn" 
                delay={1200} 
                duration={1000}
                style={styles.tagline}
              >
                Healthcare access with clarity and dignity
              </Animatable.Text>
            </Animated.View>

            {/* Auth Card */}
            <AuthCard
              title="Create Account"
              subtitle="Join QORA in a few steps. We'll help you book appointments easily."
            >
              <View style={styles.formContainer}>
                {/* Full Name Input */}
                <AuthInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  autoCapitalize="words"
                  error={errors.fullName}
                  icon="person-outline"
                  autoFocus={true}
                />

                {/* Email Input */}
                <AuthInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  icon="mail-outline"
                />

                {/* Password Input */}
                <AuthInput
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry
                  error={errors.password}
                  icon="lock-closed-outline"
                />

                {/* Confirm Password Input */}
                <AuthInput
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  secureTextEntry
                  error={errors.confirmPassword}
                  icon="lock-closed-outline"
                />

                {/* Password Match Validation */}
                {password && confirmPassword && password !== confirmPassword && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ color: '#EF4444', fontSize: 12 }}>
                      Passwords must match
                    </Text>
                  </View>
                )}

                {/* Register Button */}
                <AuthButton
                  title={loading ? "Creating Account..." : "Create Account"}
                  onPress={handleRegister}
                  disabled={!isFormValid || loading}
                  loading={loading}
                  icon="person-add-outline"
                  iconPosition="right"
                />

                {/* Login Link */}
                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Already have an account? </Text>
                  <AuthButton
                    title="Sign in here"
                    onPress={() => navigation.navigate('Login')}
                    variant="link"
                    icon="log-in-outline"
                    iconPosition="right"
                  />
                </View>
              </View>
            </AuthCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: 3,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  signUpText: {
    color: '#64748B',
    fontSize: 14,
  },
};