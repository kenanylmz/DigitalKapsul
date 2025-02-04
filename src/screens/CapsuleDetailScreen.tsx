import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import {Text, Card, Button, Surface, Title} from 'react-native-paper';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {RootStackParamList} from '../navigation/AppNavigator';
import {RootState} from '../store';
import {removeCapsule, updateCapsule} from '../store/capsuleSlice';
import {COLORS, SPACING} from '../theme';
import Video from 'react-native-video';
import CapsuleAnimation from '../components/CapsuleAnimation';
import LinearGradient from 'react-native-linear-gradient';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type CapsuleDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'CapsuleDetail'
>;

const CapsuleDetailScreen = () => {
  const route = useRoute<CapsuleDetailScreenRouteProp>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const capsule = useSelector((state: RootState) =>
    state.capsules.items.find(item => item.id === route.params.capsuleId),
  );

  if (!capsule) {
    return (
      <View style={styles.container}>
        <Text>Kapsül bulunamadı.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    setShowDeleteAnimation(true);
  };

  const handleDeleteAnimationComplete = () => {
    dispatch(removeCapsule(capsule.id));
    navigation.goBack();
  };

  const canOpen = new Date(capsule.openDate) <= new Date();

  const handleOpenCapsule = () => {
    if (canOpen) {
      setShowAnimation(true);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    dispatch(
      updateCapsule({
        ...capsule,
        isLocked: false,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.contentSurface}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../assets/images/time-capsule-bg.png')}
                style={styles.capsuleIcon}
              />
              <Title style={styles.title}>{capsule.title}</Title>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {capsule.isLocked ? '🔒 Kilitli' : '🔓 Açık'}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{capsule.description}</Text>

          <View style={styles.dateContainer}>
            <View style={styles.dateBox}>
              <Image
                source={require('../assets/images/create-date-icon.png')}
                style={styles.dateIcon}
              />
              <View>
                <Text style={styles.dateLabel}>Oluşturulma</Text>
                <Text style={styles.dateValue}>
                  {format(new Date(capsule.createdAt), 'dd MMMM yyyy', {
                    locale: tr,
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.dateBox}>
              <Image
                source={require('../assets/images/open-date-icon.png')}
                style={styles.dateIcon}
              />
              <View>
                <Text style={styles.dateLabel}>Açılış Tarihi</Text>
                <Text style={styles.dateValue}>
                  {format(new Date(capsule.openDate), 'dd MMMM yyyy', {
                    locale: tr,
                  })}
                </Text>
              </View>
            </View>
          </View>

          {!capsule.isLocked && (
            <View style={styles.contentContainer}>
              <Text style={styles.contentLabel}>İçerik</Text>
              {capsule.type === 'text' ? (
                <Surface style={styles.textContent}>
                  <Text style={styles.content}>{capsule.content}</Text>
                </Surface>
              ) : capsule.mediaContent ? (
                <View style={styles.mediaContainer}>
                  {capsule.type === 'image' ? (
                    <Image
                      source={{uri: capsule.mediaContent.uri}}
                      style={styles.media}
                      resizeMode="cover"
                    />
                  ) : (
                    <Video
                      source={{uri: capsule.mediaContent.uri}}
                      style={styles.media}
                      controls={true}
                      resizeMode="cover"
                    />
                  )}
                </View>
              ) : (
                <Text style={styles.errorText}>Medya bulunamadı</Text>
              )}
            </View>
          )}

          {capsule.recipientEmail && (
            <View style={styles.recipientContainer}>
              <Image
                source={require('../assets/images/recipient-icon.png')}
                style={styles.recipientIcon}
              />
              <View>
                <Text style={styles.recipientLabel}>Alıcı</Text>
                <Text style={styles.recipientValue}>
                  {capsule.recipientEmail}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {capsule.isLocked && (
              <Button
                mode="contained"
                onPress={handleOpenCapsule}
                style={styles.button}
                disabled={!canOpen}>
                {canOpen ? 'Kapsülü Aç' : 'Henüz Açılamaz'}
              </Button>
            )}
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={[styles.button, styles.deleteButton]}
              textColor={COLORS.error}>
              Kapsülü Sil
            </Button>
          </View>
        </Surface>
      </ScrollView>

      {showAnimation && (
        <CapsuleAnimation
          type="open"
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      {showDeleteAnimation && (
        <CapsuleAnimation
          type="delete"
          onAnimationComplete={handleDeleteAnimationComplete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentSurface: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.card.border,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  capsuleIcon: {
    width: 32,
    height: 32,
    marginRight: SPACING.sm,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  dateBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.card.highlight,
    borderRadius: 8,
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  dateIcon: {
    width: 24,
    height: 24,
    marginRight: SPACING.sm,
    opacity: 0.7,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  dateValue: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  contentContainer: {
    marginTop: SPACING.md,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  textContent: {
    padding: SPACING.md,
    backgroundColor: COLORS.card.highlight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  content: {
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  recipientContainer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.card.highlight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  recipientIcon: {
    width: 24,
    height: 24,
    marginRight: SPACING.sm,
    opacity: 0.7,
  },
  recipientLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  recipientValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: SPACING.lg,
  },
  button: {
    marginBottom: SPACING.sm,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontStyle: 'italic',
  },
});

export default CapsuleDetailScreen;
