import React, {useEffect, useState, useMemo} from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ImageBackground,
  Dimensions,
} from 'react-native';

import {ActivityIndicator, Surface, IconButton} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useSelector, useDispatch} from 'react-redux';

import {RootStackParamList} from '../navigation/AppNavigator';

import {RootState} from '../store';

import {COLORS, SPACING} from '../theme';

import AnimatedCapsuleCard from '../components/AnimatedCapsuleCard';

import AnimatedFAB from '../components/AnimatedFAB';

import {loadCapsules} from '../store/capsuleSlice';

import FilterBar from '../components/FilterBar';
import CapsuleStats from '../components/CapsuleStats';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] =
    useState<CapsuleCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const capsules = useSelector((state: RootState) => state.capsules.items);

  const filteredCapsules = useMemo(() => {
    return capsules.filter(capsule => {
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === 'tümü' ||
        capsule.category === selectedCategory;

      const matchesSearch =
        !searchQuery ||
        capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [capsules, selectedCategory, searchQuery]);

  const openedCapsules = useMemo(() => {
    return capsules.filter(c => !c.isLocked).length;
  }, [capsules]);

  const nearestCapsule = useMemo(() => {
    const now = new Date();
    return capsules
      .filter(c => c.isLocked && new Date(c.openDate) > now)
      .sort(
        (a, b) =>
          new Date(a.openDate).getTime() - new Date(b.openDate).getTime(),
      )[0]?.openDate;
  }, [capsules]);

  const loading = useSelector((state: RootState) => state.capsules.loading);

  const error = useSelector((state: RootState) => state.capsules.error);

  useEffect(() => {
    dispatch(loadCapsules());
  }, [dispatch]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          iconColor={COLORS.white}
          size={24}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📬</Text>
      </View>
      <Text style={styles.emptyText}>Henüz hiç kapsül oluşturmadınız.</Text>
      <Text style={styles.emptySubText}>
        Yeni bir kapsül oluşturmak için + butonuna tıklayın.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <CapsuleStats
        totalCapsules={capsules.length}
        openedCapsules={openedCapsules}
        nearestCapsule={nearestCapsule}
      />
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSearch={setSearchQuery}
      />
      {loading ? (
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : capsules.length === 0 ? (
        renderEmptyList()
      ) : (
        <FlatList
          data={filteredCapsules}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <AnimatedCapsuleCard
              capsule={item}
              index={index}
              onPress={() =>
                navigation.navigate('CapsuleDetail', {capsuleId: item.id})
              }
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
        />
      )}
      <AnimatedFAB onPress={() => navigation.navigate('CreateCapsule')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  listContainer: {
    padding: SPACING.sm,
    paddingTop: SPACING.md,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyIconContainer: {
    marginBottom: SPACING.md,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.text.light,
    textAlign: 'center',
  },
});

export default HomeScreen;
