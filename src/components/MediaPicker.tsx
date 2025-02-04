import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Button} from 'react-native-paper';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import Video from 'react-native-video';
import {MediaContent} from '../types';
import {COLORS, SPACING} from '../theme';

interface MediaPickerProps {
  type: 'image' | 'video';
  value?: MediaContent;
  onChange: (media: MediaContent | undefined) => void;
}

const MediaPicker = ({type, value, onChange}: MediaPickerProps) => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Kamera İzni',
            message: 'Uygulama kameranıza erişmek istiyor.',
            buttonNeutral: 'Daha Sonra Sor',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleSelectMedia = async (useCamera: boolean) => {
    if (useCamera) {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return;
      }
    }

    const options: CameraOptions | ImageLibraryOptions = {
      mediaType: type,
      quality: 1,
      saveToPhotos: true,
      includeBase64: true,
    };

    try {
      const result = useCamera
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        onChange({
          uri: asset.uri!,
          type: asset.type || `${type}/${type === 'image' ? 'jpeg' : 'mp4'}`,
          fileName:
            asset.fileName ||
            `${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`,
          base64: asset.base64,
        });
      }
    } catch (error) {
      console.error('Media seçimi hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
      {value ? (
        <View style={styles.previewContainer}>
          {type === 'image' ? (
            <Image source={{uri: value.uri}} style={styles.preview} />
          ) : (
            <Video
              source={{uri: value.uri}}
              style={styles.preview}
              paused={true}
              resizeMode="cover"
              repeat={true}
            />
          )}
          <Button
            mode="contained"
            onPress={() => onChange(undefined)}
            style={styles.removeButton}
            icon="delete">
            Medyayı Kaldır
          </Button>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => handleSelectMedia(false)}
            style={styles.button}
            icon="image">
            Galeriden Seç
          </Button>
          <Button
            mode="contained"
            onPress={() => handleSelectMedia(true)}
            style={styles.button}
            icon="camera">
            Kamera
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  previewContainer: {
    alignItems: 'center',
    width: '100%',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.letter.contentBg,
  },
  removeButton: {
    backgroundColor: COLORS.error,
  },
});

export default MediaPicker;
