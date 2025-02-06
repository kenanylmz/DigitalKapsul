import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {Text, Button, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SPACING} from '../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'primary';
    icon?: string;
  }>;
  icon?: string;
  onDismiss?: () => void;
}

let alertInstance: {
  show: (options: Omit<CustomAlertProps, 'visible'>) => void;
  hide: () => void;
} | null = null;

const CustomAlertComponent = () => {
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<CustomAlertProps, 'visible'>>({
    title: '',
    message: '',
    buttons: [],
  });

  React.useEffect(() => {
    alertInstance = {
      show: (options) => {
        setConfig(options);
        setVisible(true);
      },
      hide: () => setVisible(false),
    };
  }, []);

  const [scaleAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'primary':
        return styles.primaryButton;
      case 'cancel':
        return styles.cancelButton;
      default:
        return styles.defaultButton;
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'primary':
        return styles.primaryButtonText;
      case 'cancel':
        return styles.cancelButtonText;
      default:
        return styles.defaultButtonText;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <Surface style={styles.content}>
            {config.icon && (
              <View style={styles.iconContainer}>
                <Icon name={config.icon} size={40} color={COLORS.primary} />
              </View>
            )}
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.message}>{config.message}</Text>
            <View style={styles.buttonContainer}>
              {config.buttons?.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.button, getButtonStyle(button.style)]}
                  onPress={button.onPress}>
                  {button.icon && (
                    <Icon
                      name={button.icon}
                      size={20}
                      color={
                        button.style === 'primary'
                          ? COLORS.white
                          : COLORS.primary
                      }
                      style={styles.buttonIcon}
                    />
                  )}
                  <Text style={getButtonTextStyle(button.style)}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Surface>
        </Animated.View>
      </View>
    </Modal>
  );
};

export const CustomAlert = {
  show: (options: Omit<CustomAlertProps, 'visible'>) => {
    alertInstance?.show(options);
  },
  hide: () => {
    alertInstance?.hide();
  },
};

export default CustomAlertComponent;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH - SPACING.lg * 2,
    maxWidth: 400,
  },
  content: {
    backgroundColor: 'rgba(30, 31, 34, 0.95)',
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.text.secondary,
  },
  defaultButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontSize: 16,
  },
  defaultButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
}); 