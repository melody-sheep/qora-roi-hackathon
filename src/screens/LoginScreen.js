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
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import ParticlesBackground from '../components/ParticlesBackground';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 1: Email, 2: Password, 3: Processing
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateEmail()) {
        setStep(2);
        setErrors({});
      }
    } else if (step === 2) {
      if (validatePassword()) {
        handleLogin();
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setErrors({});
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setStep(3);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Logged in successfully!',
        [{ text: 'OK', onPress: () => console.log('Login demo') }]
      );
      console.log('Login attempt:', { email, password });
      setStep(2); // Reset to password step
    }, 2000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'A password reset link will be sent to your email.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => console.log('Send reset link') },
      ]
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Email Step
        return (
          <Animatable.View animation="fadeIn" duration={500}>
            <Text style={styles.stepTitle}>Enter your email</Text>
            <Text style={styles.stepSubtitle}>We'll use this to sign you in</Text>
            
            <AuthInput
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              icon="mail-outline"
              autoFocus={true}
            />

            <View style={styles.buttonContainer}>
              <AuthButton
                title="Next"
                onPress={handleNext}
                disabled={!email.trim()}
                icon="arrow-forward-outline"
                iconPosition="right"
              />
            </View>
          </Animatable.View>
        );

      case 2: // Password Step
        return (
          <Animatable.View animation="fadeIn" duration={500}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back-outline" size={24} color="#2563EB" />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.stepTitle}>Welcome back</Text>
                <Text style={styles.emailText}>{email}</Text>
              </View>
            </View>
            
            <Text style={styles.stepSubtitle}>Enter your password to continue</Text>
            
            <AuthInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
              error={errors.password}
              icon="lock-closed-outline"
              autoFocus={true}
            />

            <View style={styles.forgotPasswordContainer}>
              <AuthButton
                title="Forgot Password?"
                onPress={handleForgotPassword}
                variant="link"
                icon="help-circle-outline"
                iconPosition="right"
              />
            </View>

            <View style={styles.buttonContainer}>
              <AuthButton
                title={loading ? "Signing in..." : "Sign In"}
                onPress={handleNext}
                disabled={!password.trim() || loading}
                loading={loading}
                icon="log-in-outline"
                iconPosition="right"
              />
            </View>
          </Animatable.View>
        );

      case 3: // Processing Step
        return (
          <Animatable.View animation="fadeIn" duration={500} style={styles.processingContainer}>
            <Ionicons name="lock-closed-outline" size={60} color="#2563EB" />
            <Text style={styles.processingTitle}>Signing you in...</Text>
            <Text style={styles.processingText}>Please wait while we verify your credentials</Text>
          </Animatable.View>
        );

      default:
        return null;
    }
  };

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

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, step >= 1 && styles.activeStep]} />
              <View style={[styles.stepLine, step >= 2 && styles.activeStep]} />
              <View style={[styles.stepDot, step >= 2 && styles.activeStep]} />
            </View>

            {/* Auth Card */}
            <AuthCard title={step === 1 ? "Sign In" : step === 2 ? "Enter Password" : "Processing"}>
              {renderStepContent()}

              {/* Sign Up Link (only shown in step 1) */}
              {step === 1 && (
                <Animatable.View animation="fadeIn" delay={300} style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <AuthButton
                    title="Register here"
                    onPress={() => navigation.navigate('Register')}
                    variant="link"
                    icon="person-add-outline"
                    iconPosition="right"
                  />
                </Animatable.View>
              )}
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginHorizontal: 24,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  activeStep: {
    backgroundColor: '#2563EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#64748B',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 24,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  processingTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 20,
    marginBottom: 8,
  },
  processingText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
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