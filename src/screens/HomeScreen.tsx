import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootState} from '../store';
import {COLORS, SPACING} from '../theme';
import AnimatedFAB from '../components/AnimatedFAB';
import {loadCapsules} from '../store/capsuleSlice';
import CapsuleStats from '../components/CapsuleStats';
import CapsuleList from '../components/CapsuleList';

type TabType = 'personal' | 'sent' | 'received';

type RootStackParamList = {
  CapsuleDetail: {capsuleId: string};
  CreateCapsule: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const HomeScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  const capsules = useSelector((state: RootState) => state.capsules.items);
  const loading = useSelector((state: RootState) => state.capsules.loading);

  const categorizedCapsules: Record<TabType, typeof capsules> = {
    personal: capsules.filter(c => c.capsuleType === 'self'),
    sent: capsules.filter(c => c.capsuleType === 'sent'),
    received: capsules.filter(c => c.capsuleType === 'received'),
  };

  useEffect(() => {
    dispatch(loadCapsules() as any); // Geçici çözüm, daha sonra düzeltilecek
  }, [dispatch]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const tabs: TabType[] = ['personal', 'sent', 'received'];

  return (
    <View style={styles.container}>
      <CapsuleStats
        totalCapsules={capsules.length}
        openedCapsules={capsules.filter(c => !c.isLocked).length}
        nearestCapsule={
          capsules
            .filter(c => c.isLocked)
            .sort(
              (a, b) =>
                new Date(a.openDate).getTime() - new Date(b.openDate).getTime(),
            )[0]?.openDate
        }
      />

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab === 'personal'
                ? 'Kişisel'
                : tab === 'sent'
                ? 'Gönderilen'
                : 'Alınan'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <CapsuleList
        capsules={categorizedCapsules[activeTab]}
        onCapsulePress={capsuleId =>
          navigation.navigate('CapsuleDetail', {capsuleId})
        }
      />

      <AnimatedFAB onPress={() => navigation.navigate('CreateCapsule')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A4E',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 78, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: COLORS.primary,
  },
});

export default HomeScreen;
