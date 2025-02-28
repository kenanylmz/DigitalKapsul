import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Button, Text, Surface, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthService} from '../../services/firebase/auth';
import {COLORS, SPACING} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import AuthCardAnimation from '../../animations/AuthCardAnimation';
import {useAuth} from '../../context/AuthContext';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const {isFlipped, setIsFlipped} = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await AuthService.login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    setIsFlipped(true);
    setTimeout(() => {
      navigation.navigate('Register');
    }, 400);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <AuthCardAnimation isFlipped={isFlipped} onFlip={() => {}}>
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <Icon name="rocket-launch" size={48} color={COLORS.primary} />
            <Text style={styles.title}>Dijital Kapsül</Text>
            <Text style={styles.subtitle}>Anılarınızı geleceğe taşıyın</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Icon
                name="email"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}>
              Giriş Yap
            </Button>
          </View>

          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={handleRegisterPress}
              style={styles.linkButton}
              labelStyle={styles.linkButtonText}>
              Hesabınız yok mu? Kayıt olun
            </Button>
          </View>
        </Surface>
      </AuthCardAnimation>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  surface: {
    padding: SPACING.xl,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  form: {
    width: '100%',
    gap: SPACING.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  button: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
  },
  buttonContent: {
    height: 56,
  },
  footer: {
    marginTop: SPACING.xl,
  },
  linkButton: {
    marginTop: SPACING.sm,
  },
  linkButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default LoginScreen;
