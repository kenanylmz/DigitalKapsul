import React, {useState} from 'react';
import {
  View, 
  StyleSheet, 
  ScrollView, 
  ImageBackground,
  Dimensions
} from 'react-native';
import {
  TextInput,
  Button,
  SegmentedButtons,
  Surface,
  Text,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {COLORS, SPACING} from '../theme';
import {addCapsule} from '../store/capsuleSlice';
import {Capsule, MediaContent} from '../types';
import MediaPicker from '../components/MediaPicker';
import CustomDatePicker from '../components/CustomDatePicker';
import CapsuleAnimation from '../components/CapsuleAnimation';

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
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    const newCapsule: Capsule = {
      id: Date.now().toString(),
      title,
      description,
      content,
      type,
      openDate: openDate.toISOString(),
      createdAt: new Date().toISOString(),
      isLocked: true,
      recipientEmail: recipientEmail || undefined,
      mediaContent,
    };

    dispatch(addCapsule(newCapsule));
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

  return (
    <ImageBackground
      source={require('../assets/images/vintage-paper-bg.jpg')}
      style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <Surface style={styles.letterSurface}>
          <View style={styles.letterHeader}>
            <View style={styles.stamp} />
            <View style={styles.postmark}>
              <Text style={styles.postmarkText}>
                {format(new Date(), 'dd.MM.yyyy')}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <TextInput
              label="Başlık"
              value={title}
              onChangeText={setTitle}
              mode="flat"
              style={styles.titleInput}
              theme={{colors: {primary: COLORS.primary}}}
            />

            <TextInput
              label="Açıklama"
              value={description}
              onChangeText={setDescription}
              mode="flat"
              multiline
              numberOfLines={3}
              style={styles.descriptionInput}
            />

            <SegmentedButtons
              value={type}
              onValueChange={value => {
                setType(value as 'text' | 'image' | 'video');
                setMediaContent(undefined);
              }}
              buttons={[
                {value: 'text', label: 'Metin'},
                {value: 'image', label: 'Fotoğraf'},
                {value: 'video', label: 'Video'},
              ]}
              style={styles.segmentedButton}
            />

            {type !== 'text' ? (
              <MediaPicker
                type={type === 'image' ? 'image' : 'video'}
                value={mediaContent}
                onChange={setMediaContent}
              />
            ) : (
              <View style={styles.textContentContainer}>
                <TextInput
                  label="İçerik"
                  value={content}
                  onChangeText={setContent}
                  mode="flat"
                  multiline
                  numberOfLines={5}
                  style={styles.contentInput}
                />
              </View>
            )}

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              icon="calendar">
              Açılış Tarihi: {format(openDate, 'dd MMMM yyyy', {locale: tr})}
            </Button>

            <TextInput
              label="Alıcı E-posta (Opsiyonel)"
              value={recipientEmail}
              onChangeText={setRecipientEmail}
              mode="flat"
              keyboardType="email-address"
              style={styles.emailInput}
            />
          </View>

          <View style={styles.sealContainer}>
            <View style={styles.waxSeal}>
              <Text style={styles.sealText}>DK</Text>
            </View>
          </View>
        </Surface>
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleCreateCapsule}
        style={styles.createButton}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  letterSurface: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    elevation: 4,
  },
  letterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  stamp: {
    width: 50,
    height: 60,
    backgroundColor: COLORS.primary,
    opacity: 0.8,
    borderRadius: 4,
  },
  postmark: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.text.light,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  postmarkText: {
    color: COLORS.text.secondary,
    fontSize: 12,
  },
  content: {
    padding: SPACING.sm,
  },
  titleInput: {
    backgroundColor: 'transparent',
    marginBottom: SPACING.md,
    fontSize: 18,
  },
  descriptionInput: {
    backgroundColor: 'transparent',
    marginBottom: SPACING.md,
  },
  contentInput: {
    backgroundColor: 'transparent',
    marginBottom: SPACING.md,
  },
  textContentContainer: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
    paddingLeft: SPACING.sm,
    marginVertical: SPACING.md,
  },
  dateButton: {
    marginVertical: SPACING.md,
  },
  emailInput: {
    backgroundColor: 'transparent',
    marginBottom: SPACING.md,
  },
  sealContainer: {
    alignItems: 'flex-end',
    marginTop: SPACING.md,
  },
  waxSeal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  sealText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  createButton: {
    margin: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  segmentedButton: {
    marginBottom: SPACING.md,
  },
});

export default CreateCapsuleScreen;
