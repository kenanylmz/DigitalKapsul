import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {TextInput, Button, Text, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthService} from '../../services/firebase/auth';
import {COLORS, SPACING} from '../../theme';
import {useNavigation} from '@react-navigation/native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor');
        return;
      }

      setLoading(true);
      setError('');
      await AuthService.register(email, password);
      navigation.navigate('VerificationScreen', {email});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.iconContainer}>
          <Icon name="account-plus" size={64} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Hesap Oluştur</Text>
        <Text style={styles.subtitle}>
          Dijital Kapsül'e hoş geldiniz
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" color={COLORS.primary} />}
            theme={{colors: {text: COLORS.white, placeholder: COLORS.white}}}
          />

          <TextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" color={COLORS.primary} />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                color={COLORS.primary}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            theme={{colors: {text: COLORS.white, placeholder: COLORS.white}}}
          />

          <TextInput
            label="Şifre Tekrar"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" color={COLORS.primary} />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                color={COLORS.primary}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            theme={{colors: {text: COLORS.white, placeholder: COLORS.white}}}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}>
          Kayıt Ol
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
          labelStyle={styles.linkButtonText}>
          Zaten hesabınız var mı? Giriş yapın
        </Button>
      </Surface>
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
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  linkButton: {
    marginTop: SPACING.md,
  },
  linkButtonText: {
    color: COLORS.primary,
  },
  error: {
    color: COLORS.error,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
});

export default RegisterScreen; 