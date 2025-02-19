import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import {COLORS, SPACING} from '../theme';
import AnimatedCapsuleCard from './AnimatedCapsuleCard';
import {Capsule} from '../types';

interface CapsuleTabContentProps {
  capsules: Capsule[];
  onCapsulePress: (capsuleId: string) => void;
}

const CapsuleTabContent = ({capsules, onCapsulePress}: CapsuleTabContentProps) => {
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📬</Text>
      </View>
      <Text style={styles.emptyText}>Bu kategoride henüz kapsül bulunmuyor.</Text>
      <Text style={styles.emptySubText}>
        Yeni bir kapsül oluşturmak için + butonuna tıklayın.
      </Text>
    </View>
  );

  return (
    <FlatList
      data={capsules}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => (
        <AnimatedCapsuleCard
          capsule={item}
          index={index}
          onPress={() => onCapsulePress(item.id)}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyList}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: SPACING.sm,
    paddingTop: SPACING.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    minHeight: 300,
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

export default CapsuleTabContent; 