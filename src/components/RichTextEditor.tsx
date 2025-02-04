import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import {COLORS, LETTER_FONTS, SPACING} from '../theme';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectionChange?: (x: number, y: number) => void;
}

const RichTextEditor = ({
  value,
  onChangeText,
  onSelectionChange,
}: RichTextEditorProps) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const inkAnimation = useRef(new Animated.Value(0)).current;

  const animateInk = () => {
    Animated.sequence([
      Animated.timing(inkAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(inkAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getTextStyle = () => {
    return {
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecorationLine: isUnderline ? 'underline' : 'none',
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <IconButton
          icon="format-bold"
          size={24}
          onPress={() => setIsBold(!isBold)}
          iconColor={isBold ? COLORS.primary : COLORS.letter.ink}
        />
        <View style={styles.divider} />
        <IconButton
          icon="format-italic"
          size={24}
          onPress={() => setIsItalic(!isItalic)}
          iconColor={isItalic ? COLORS.primary : COLORS.letter.ink}
        />
        <View style={styles.divider} />
        <IconButton
          icon="format-underline"
          size={24}
          onPress={() => setIsUnderline(!isUnderline)}
          iconColor={isUnderline ? COLORS.primary : COLORS.letter.ink}
        />
      </View>

      <View style={styles.editorContainer}>
        <TextInput
          multiline
          value={value}
          onChangeText={text => {
            onChangeText(text);
            animateInk();
          }}
          style={[
            styles.editor,
            getTextStyle(),
            {
              textShadowColor: COLORS.letter.ink,
              textShadowOffset: {width: 0.5, height: 0.5},
              textShadowRadius: 0.5,
            },
          ]}
          placeholder="Mektubunuzu yazın..."
          placeholderTextColor={COLORS.letter.placeholder}
          onSelectionChange={e => {
            const selection = e.nativeEvent.selection;
            if (onSelectionChange) {
              onSelectionChange(selection.start, selection.end);
            }
          }}
        />

        <Animated.View
          style={[
            styles.inkEffect,
            {
              opacity: inkAnimation,
              transform: [
                {
                  scale: inkAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.2, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    padding: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.letter.lines,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.letter.lines,
    marginHorizontal: SPACING.sm,
  },
  editorContainer: {
    flex: 1,
    position: 'relative',
  },
  editor: {
    flex: 1,
    fontFamily: LETTER_FONTS.handwriting,
    fontSize: 18,
    color: COLORS.white,
    lineHeight: 28,
    textAlignVertical: 'top',
    padding: SPACING.sm,
  },
  inkEffect: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: COLORS.letter.ink,
    borderRadius: 3,
    opacity: 0.6,
  },
});

export default RichTextEditor; 