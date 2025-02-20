import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Surface, Text, Avatar, Button} from 'react-native-paper';
import {COLORS, SPACING} from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserProfile} from '../services/firebase/database';
import {AuthService} from '../services/firebase/auth';
import {CustomAlert} from '../components/CustomAlert';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
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
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Bekleyen</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Icon name="lock-open" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Açılan</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Icon name="rocket-launch" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>20</Text>
            <Text style={styles.statLabel}>Toplam</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout">
          Çıkış Yap
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A4E', // Ana tema rengi
  },
  loadingText: {
    color: COLORS.white,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  profileCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(108, 99, 255, 0.1)', // Mor tonunda yarı saydam
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
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
    marginTop: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.lg,
    backgroundColor: 'rgba(108, 99, 255, 0.05)', // Daha koyu arka plan
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
  },
  logoutButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.error,
  },
});

export default ProfileScreen; 