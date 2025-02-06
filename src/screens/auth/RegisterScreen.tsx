import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Button, Text, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthService} from '../../services/firebase/auth';
import {COLORS, SPACING} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import AuthCardAnimation from '../../animations/AuthCardAnimation';
import {useAuth} from '../../context/AuthContext';
import {CustomAlert} from '../../components/CustomAlert';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const {isFlipped, setIsFlipped} = useAuth();

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor');
        return;
      }

      setLoading(true);
      setError('');

      console.log('Register values:', {
        // Debug için
        email,
        password,
        firstName,
        lastName,
      });

      await AuthService.register(
        email.trim(),
        password.trim(),
        firstName.trim(),
        lastName.trim(),
      );

      CustomAlert.show({
        title: 'Hesap Oluşturuldu!',
        message:
          'Tebrikler! Hesabınız başarıyla oluşturuldu. Lütfen e-posta adresinize gönderilen doğrulama bağlantısını kontrol edin.',
        icon: 'email-check-outline',
        buttons: [
          {
            text: 'Giriş Yap',
            style: 'primary',
            icon: 'login',
            onPress: () => {
              CustomAlert.hide();
              setIsFlipped(true);
              navigation.navigate('Login');
            },
          },
        ],
      });

      // 5 saniye sonra otomatik yönlendirme
      setTimeout(() => {
        CustomAlert.hide();
        setIsFlipped(true);
        navigation.navigate('Login');
      }, 5000);
    } catch (err: any) {
      console.error('Register error:', err); // Debug için
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    setIsFlipped(true);
    setTimeout(() => {
      navigation.navigate('Login');
    }, 400);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <AuthCardAnimation isFlipped={isFlipped} onFlip={() => {}}>
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <Icon name="account-plus" size={40} color={COLORS.primary} />
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>Dijital Kapsül'e hoş geldiniz</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Icon
                name="account"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Ad"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon
                name="account-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Soyad"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>

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

            <View style={styles.inputWrapper}>
              <Icon
                name="lock-check"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Şifre Tekrar"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
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
          </View>

          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={handleLoginPress}
              style={styles.linkButton}
              labelStyle={styles.linkButtonText}>
              Zaten hesabınız var mı? Giriş yapın
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
    padding: SPACING.md,
  },
  surface: {
    padding: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  form: {
    width: '100%',
    gap: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: SPACING.xs,
  },
  inputIcon: {
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    height: '100%',
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  button: {
    marginTop: SPACING.xs,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
  },
  buttonContent: {
    height: 48,
  },
  footer: {
    marginTop: SPACING.sm,
  },
  linkButton: {
    marginTop: SPACING.xs,
  },
  linkButtonText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  error: {
    color: COLORS.error,
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default RegisterScreen;
