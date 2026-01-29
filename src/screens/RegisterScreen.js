import React, { useState } from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);

  const handleRegister = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        
        <View style={styles.background} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/qora_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.tagline}>
                Healthcare access with clarity and dignity
              </Text>
            </View>

            {/* Register Card */}
            <View style={styles.card}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join QORA in a few simple steps</Text>
              
              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#94A3B8"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Create a password"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText1}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  <TouchableOpacity onPress={() => setSecureText1(!secureText1)}>
                    <Ionicons 
                      name={secureText1 ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.passwordHint}>At least 6 characters</Text>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Repeat your password"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureText2}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                  <TouchableOpacity onPress={() => setSecureText2(!secureText2)}>
                    <Ionicons 
                      name={secureText2 ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Password match validation */}
                {password && confirmPassword && password !== confirmPassword && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.button, (!fullName || !email || !password || !confirmPassword || loading) && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={!fullName || !email || !password || !confirmPassword || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <Ionicons name="person-add" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.6}
                >
                  <Text style={styles.loginLink}>Sign in here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    padding: 0,
    margin: 0,
    minHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  passwordHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  loginText: {
    color: '#64748B',
    fontSize: 14,
  },
  loginLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});