import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Surface, Text, Avatar, Button} from 'react-native-paper';
import {COLORS, SPACING} from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserProfile, DatabaseService} from '../services/firebase/database';
import {AuthService} from '../services/firebase/auth';
import {CustomAlert} from '../components/CustomAlert';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {useNavigation} from '@react-navigation/native';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
}

interface CapsuleStats {
  total: number;
  opened: number;
  waiting: number;
  sent: number;
  received: number;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CapsuleStats>({
    total: 0,
    opened: 0,
    waiting: 0,
    sent: 0,
    received: 0,
  });

  const capsules = useSelector((state: RootState) => state.capsules.items);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserProfile();
    calculateStats();
  }, [capsules]);

  const loadUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const newStats: CapsuleStats = {
      total: capsules.length,
      opened: capsules.filter(c => !c.isLocked).length,
      waiting: capsules.filter(c => c.isLocked).length,
      sent: capsules.filter(c => c.capsuleType === 'sent').length,
      received: capsules.filter(c => c.capsuleType === 'received').length,
    };
    setStats(newStats);
  };

  const handleLogout = async () => {
    CustomAlert.show({
      title: 'Çıkış Yap',
      message: 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      icon: 'logout',
      buttons: [
        {
          text: 'İptal',
          style: 'cancel',
          onPress: () => CustomAlert.hide(),
        },
        {
          text: 'Çıkış Yap',
          style: 'primary',
          icon: 'logout',
          onPress: async () => {
            try {
              await AuthService.logout();
              CustomAlert.hide();
            } catch (error) {
              console.error('Çıkış yapılırken hata:', error);
            }
          },
        },
      ],
    });
  };

  const handleDeleteAccount = () => {
    CustomAlert.show({
      title: 'Hesabı Sil',
      message:
        'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.',
      icon: 'alert',
      buttons: [
        {
          text: 'İptal',
          style: 'cancel',
          onPress: () => CustomAlert.hide(),
        },
        {
          text: 'Hesabı Sil',
          style: 'destructive',
          icon: 'delete',
          onPress: async () => {
            try {
              await DatabaseService.deleteUserAccount();

              // Başarılı silme mesajı göster
              CustomAlert.show({
                title: 'Başarılı',
                message: 'Hesabınız başarıyla silindi.',
                icon: 'check-circle',
                buttons: [
                  {
                    text: 'Tamam',
                    style: 'primary',
                    onPress: () => {
                      CustomAlert.hide();
                      // Navigation ile giriş ekranına yönlendir
                      navigation.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                      });
                    },
                  },
                ],
              });
            } catch (error: any) {
              CustomAlert.show({
                title: 'Hata',
                message: error.message || 'Hesap silinirken bir hata oluştu.',
                icon: 'alert-circle',
                buttons: [
                  {
                    text: 'Tamam',
                    style: 'primary',
                    onPress: () => CustomAlert.hide(),
                  },
                ],
              });
            }
          },
        },
      ],
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Surface style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={
                profile?.photoURL
                  ? {uri: profile.photoURL}
                  : require('../assets/images/default-avatar.png')
              }
            />
            <Text style={styles.name}>
              {profile?.firstName} {profile?.lastName}
            </Text>
            <Text style={styles.email}>{profile?.email}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="clock-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.waiting}</Text>
              <Text style={styles.statLabel}>Bekleyen</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Icon name="lock-open-variant" size={24} color={COLORS.success} />
              <Text style={styles.statValue}>{stats.opened}</Text>
              <Text style={styles.statLabel}>Açılan</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Icon name="rocket-launch" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="send" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.sent}</Text>
              <Text style={styles.statLabel}>Gönderilen</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Icon name="inbox-arrow-down" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.received}</Text>
              <Text style={styles.statLabel}>Alınan</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
              icon="logout">
              Çıkış Yap
            </Button>

            <Button
              mode="contained"
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
              icon="delete">
              Hesabı Sil
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A4E',
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  profileCard: {
    padding: SPACING.xl,
    borderRadius: 16,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.md,
  },
  email: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.md,
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    padding: SPACING.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    alignSelf: 'stretch',
  },
  buttonContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    height: 48,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    height: 48,
  },
  loadingText: {
    color: COLORS.white,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default ProfileScreen;
