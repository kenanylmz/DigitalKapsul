import React, {useEffect} from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ImageBackground,
  Dimensions,
} from 'react-native';

import {ActivityIndicator, Surface} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useSelector, useDispatch} from 'react-redux';

import {RootStackParamList} from '../navigation/AppNavigator';

import {RootState} from '../store';

import {COLORS, SPACING} from '../theme';

import AnimatedCapsuleCard from '../components/AnimatedCapsuleCard';

import AnimatedFAB from '../components/AnimatedFAB';

import {loadCapsules} from '../store/capsuleSlice';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const dispatch = useDispatch();

  const capsules = useSelector((state: RootState) => state.capsules.items);

  const loading = useSelector((state: RootState) => state.capsules.loading);

  const error = useSelector((state: RootState) => state.capsules.error);

  useEffect(() => {
    dispatch(loadCapsules());
  }, [dispatch]);

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
          data={capsules}
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
