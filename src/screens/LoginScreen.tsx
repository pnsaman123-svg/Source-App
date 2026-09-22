import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useResponsive } from '../utils/responsive';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

// Crisp Google "G" SVG Logo
const GoogleLogo = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </Svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { isSmallScreen, isLargeScreen, horizontalPadding } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    // Dummy Sign In: Instantly authenticate anything entered
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 450);
  };

  const handleGoogleSignIn = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 450);
  };

  return (
    <View style={styles.root}>
      {/* Background Gradient */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={[
                styles.scrollContainer,
                { paddingHorizontal: horizontalPadding },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Title & Subtitle Matching Figma Node 1986:339 */}
              <View style={styles.headerSection}>
                <Text style={[styles.title, isSmallScreen && { fontSize: 28, lineHeight: 34 }]}>
                  Hey,{'\n'}Welcome Back
                </Text>
                <Text style={styles.subtitle}>
                  It’s good to see you again! Sign in to continue your journey with us!
                </Text>
              </View>

              {/* Input Form Fields */}
              <View style={styles.formSection}>
                {/* Email Input */}
                <View style={styles.inputCard}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email id"
                    placeholderTextColor="#A0A0A5"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password Input */}
                <View style={[styles.inputCard, styles.passwordCard]}>
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    placeholder="Password"
                    placeholderTextColor="#A0A0A5"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Feather
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>

                {/* Forget Password */}
                <TouchableOpacity
                  style={styles.forgetPasswordContainer}
                  onPress={() => {
                    // Dummy forgot password response
                    alert('Password reset link sent to your email.');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgetPasswordText}>Forget password?</Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={[styles.signInButton, isLoading && { opacity: 0.85 }]}
                  onPress={handleSignIn}
                  activeOpacity={0.85}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.signInButtonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                {/* Divider Line */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Continue with Google Button */}
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  activeOpacity={0.85}
                  disabled={isLoading}
                >
                  <GoogleLogo />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>

              {/* Footer: Sign Up prompt */}
              <View style={styles.footerSection}>
                <Text style={styles.footerText}>
                  Don't have an account?{' '}
                  <Text
                    style={styles.signUpText}
                    onPress={handleSignIn}
                  >
                    Sign up
                  </Text>
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E8E8ED',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#737373',
    fontWeight: '400',
    maxWidth: '92%',
  },
  formSection: {
    width: '100%',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 58,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  textInput: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    height: '100%',
  },
  passwordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 10,
  },
  eyeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgetPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 28,
  },
  forgetPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  signInButton: {
    backgroundColor: '#1A1A1A',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E5',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#ECECEE',
  },
  googleButtonText: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  signUpText: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
});
