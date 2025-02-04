import React from 'react';
import {View, StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import Video from 'react-native-video';
import {COLORS, SPACING} from '../theme';

const {width} = Dimensions.get('window');

const OpenCapsuleScreen = ({route}) => {
  const {capsule} = route.params;

  const renderContent = () => {
    switch (capsule.type) {
      case 'image':
        return (
          <View style={styles.mediaContainer}>
            <Image
              source={{
                uri: capsule.mediaContent?.base64
                  ? `data:${capsule.mediaContent.type};base64,${capsule.mediaContent.base64}`
                  : capsule.mediaUrl,
              }}
              style={styles.media}
              resizeMode="contain"
            />
          </View>
        );
      case 'video':
        return (
          <View style={styles.mediaContainer}>
            <Video
              source={{
                uri: capsule.mediaContent?.uri || capsule.mediaUrl,
              }}
              style={styles.media}
              resizeMode="contain"
              controls={true}
              repeat={true}
            />
          </View>
        );
      default:
        return (
          <ScrollView style={styles.contentScroll}>
            <Text style={styles.content}>{capsule.content}</Text>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.letter.contentBg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: width - SPACING.md * 2,
    height: '100%',
    backgroundColor: COLORS.letter.contentBg,
  },
  contentScroll: {
    flex: 1,
    backgroundColor: COLORS.letter.contentBg,
    borderRadius: 8,
    padding: SPACING.md,
  },
  content: {
    fontSize: 16,
    color: COLORS.letter.text,
    lineHeight: 24,
  },
});

export default OpenCapsuleScreen; 