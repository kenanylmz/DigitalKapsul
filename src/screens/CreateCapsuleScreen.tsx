import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import {
  TextInput,
  Button,
  SegmentedButtons,
  Surface,
  Text,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {COLORS, SPACING, LETTER_FONTS} from '../theme';
import {addCapsule} from '../store/capsuleSlice';
import {Capsule, MediaContent} from '../types';
import MediaPicker from '../components/MediaPicker';
import CustomDatePicker from '../components/CustomDatePicker';
import CapsuleAnimation from '../components/CapsuleAnimation';
import RichTextEditor from '../components/RichTextEditor';
import SealAnimation from '../components/SealAnimation';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const CreateCapsuleScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [openDate, setOpenDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<'text' | 'image' | 'video'>('text');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [mediaContent, setMediaContent] = useState<MediaContent>();
  const [showAnimation, setShowAnimation] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
  const inkAnimation = useRef(new Animated.Value(0)).current;
  const [images, setImages] = useState<Array<{uri: string; position: number}>>(
    [],
  );
  const [showSealAnimation, setShowSealAnimation] = useState(false);

  const months = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];

  const generateDays = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const [selectedDay, setSelectedDay] = useState(openDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(openDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(openDate.getFullYear());

  const handleCreateCapsule = () => {
    setShowSealAnimation(true);
  };

  const handleSealAnimationComplete = () => {
    const newCapsule: Capsule = {
      id: Date.now().toString(),
      title,
      description,
      content,
      type: 'text',
      openDate: openDate.toISOString(),
      createdAt: new Date().toISOString(),
      isLocked: true,
      recipientEmail: recipientEmail || undefined,
      images: images,
    };

    dispatch(addCapsule(newCapsule));
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    navigation.goBack();
  };

  const handleDateConfirm = (date: Date) => {
    setOpenDate(date);
    setShowDatePicker(false);
  };

  const isFormValid = () => {
    if (!title || !description) return false;

    switch (type) {
      case 'text':
        return !!content;
      case 'image':
      case 'video':
        return !!mediaContent;
      default:
        return false;
    }
  };

  const animateInk = (x: number, y: number) => {
    setCursorPosition({x, y});
    Animated.sequence([
      Animated.timing(inkAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(inkAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleImageAdd = (uri: string, position: number) => {
    setImages(prev => [...prev, {uri, position}]);
  };

  const handleImageRemove = (position: number) => {
    setImages(prev => prev.filter(img => img.position !== position));
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      onSurfaceVariant: COLORS.letter.text,
      outline: COLORS.letter.ink,
      text: COLORS.white,
      onSurface: COLORS.white,
      placeholder: COLORS.letter.placeholder,
      primary: COLORS.letter.ink,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ScrollView>
          <Surface style={styles.letterSurface}>
            <View style={styles.letterHeader}>
              <Text style={styles.dateText}>
                {format(new Date(), 'dd MMMM yyyy', {locale: tr})}
              </Text>
            </View>

            <View style={styles.contentContainer}>
              <TextInput
                label="Başlık"
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
              />

              <TextInput
                label="Açıklama"
                value={description}
                onChangeText={setDescription}
                style={styles.descriptionInput}
                multiline
                numberOfLines={2}
              />

              <SegmentedButtons
                value={type}
                onValueChange={value => {
                  setType(value as 'text' | 'image' | 'video');
                  setMediaContent(undefined);
                }}
                buttons={[
                  {
                    value: 'text',
                    label: 'Metin',
                    style: styles.segmentButton,
                    labelStyle: styles.segmentButtonLabel,
                  },
                  {
                    value: 'image',
                    label: 'Fotoğraf',
                    style: styles.segmentButton,
                    labelStyle: styles.segmentButtonLabel,
                  },
                  {
                    value: 'video',
                    label: 'Video',
                    style: styles.segmentButton,
                    labelStyle: styles.segmentButtonLabel,
                  },
                ]}
                style={styles.segmentedButton}
              />

              <View style={styles.contentWrapper}>
                {type === 'text' ? (
                  <View style={styles.letterContent}>
                    <RichTextEditor
                      value={content}
                      onChangeText={setContent}
                      onSelectionChange={(x, y) => animateInk(x, y)}
                    />
                  </View>
                ) : (
                  <MediaPicker
                    type={type}
                    value={mediaContent}
                    onChange={setMediaContent}
                  />
                )}
              </View>

              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                icon="calendar"
                textColor={COLORS.letter.ink}>
                Açılış Tarihi: {format(openDate, 'dd MMMM yyyy', {locale: tr})}
              </Button>

              <TextInput
                label="Alıcı E-posta (Opsiyonel)"
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                style={styles.emailInput}
              />
            </View>

            <View style={styles.sealContainer}>
              {showSealAnimation && (
                <SealAnimation
                  onAnimationComplete={handleSealAnimationComplete}
                />
              )}
            </View>
          </Surface>
        </ScrollView>

        <Button
          mode="contained"
          onPress={handleCreateCapsule}
          style={styles.createButton}
          labelStyle={styles.buttonLabel}
          disabled={!isFormValid()}>
          Kapsülü Oluştur
        </Button>

        <CustomDatePicker
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          onConfirm={handleDateConfirm}
          currentDate={openDate}
        />

        {showAnimation && (
          <CapsuleAnimation
            type="create"
            onAnimationComplete={handleAnimationComplete}
          />
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  letterSurface: {
    margin: SPACING.md,
    padding: SPACING.md,
    paddingBottom: SPACING.xl + 100,
    backgroundColor: COLORS.letter.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.letter.ribbon.primary,
    elevation: 4,
    position: 'relative',
  },
  letterHeader: {
    alignItems: 'flex-end',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.letter.lines,
  },
  dateText: {
    fontFamily: LETTER_FONTS.handwriting,
    color: COLORS.letter.text,
    fontSize: 16,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  titleInput: {
    backgroundColor: 'transparent',
    fontFamily: LETTER_FONTS.handwriting,
    fontSize: 24,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  descriptionInput: {
    backgroundColor: 'transparent',
    marginBottom: SPACING.md,
    fontSize: 16,
    color: COLORS.white,
  },
  contentWrapper: {
    backgroundColor: COLORS.letter.contentBg,
    borderRadius: 8,
    padding: SPACING.sm,
    marginVertical: SPACING.md,
    minHeight: 200,
  },
  letterContent: {
    position: 'relative',
    minHeight: 200,
  },
  dateButton: {
    marginVertical: SPACING.md,
    borderColor: COLORS.letter.ink,
  },
  emailInput: {
    backgroundColor: 'transparent',
    marginBottom: SPACING.md,
    color: COLORS.white,
  },
  sealContainer: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
    height: 100,
    marginRight: SPACING.md,
  },
  segmentedButton: {
    marginBottom: SPACING.md,
  },
  createButton: {
    margin: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  segmentButton: {
    borderColor: COLORS.letter.ink,
  },
  segmentButtonLabel: {
    color: COLORS.letter.text,
  },
  buttonLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateButtonLabel: {
    color: COLORS.letter.text,
  },
});

export default CreateCapsuleScreen;
