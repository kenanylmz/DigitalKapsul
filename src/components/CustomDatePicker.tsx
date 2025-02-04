import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, Modal, Text, Surface} from 'react-native-paper';
import {COLORS, SPACING} from '../theme';

interface CustomDatePickerProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (date: Date) => void;
  currentDate: Date;
}

const CustomDatePicker = ({
  visible,
  onDismiss,
  onConfirm,
  currentDate,
}: CustomDatePickerProps) => {
  const [selectedDay, setSelectedDay] = React.useState(currentDate.getDate());
  const [selectedMonth, setSelectedMonth] = React.useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = React.useState(currentDate.getFullYear());

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onConfirm(newDate);
  };

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
      <Surface style={styles.surface}>
        <Text variant="titleLarge" style={styles.title}>Tarih Seçin</Text>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Gün</Text>
              <ScrollView style={styles.scrollView}>
                {Array.from(
                  {length: getDaysInMonth(selectedYear, selectedMonth)},
                  (_, i) => i + 1,
                ).map(day => (
                  <Button
                    key={day}
                    mode={selectedDay === day ? 'contained' : 'text'}
                    onPress={() => setSelectedDay(day)}
                    compact>
                    {day}
                  </Button>
                ))}
              </ScrollView>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Ay</Text>
              <ScrollView style={styles.scrollView}>
                {months.map((month, index) => (
                  <Button
                    key={month}
                    mode={selectedMonth === index ? 'contained' : 'text'}
                    onPress={() => setSelectedMonth(index)}
                    compact>
                    {month}
                  </Button>
                ))}
              </ScrollView>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Yıl</Text>
              <ScrollView style={styles.scrollView}>
                {Array.from({length: 10}, (_, i) => currentDate.getFullYear() + i).map(
                  year => (
                    <Button
                      key={year}
                      mode={selectedYear === year ? 'contained' : 'text'}
                      onPress={() => setSelectedYear(year)}
                      compact>
                      {year}
                    </Button>
                  ),
                )}
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={onDismiss}>İptal</Button>
          <Button mode="contained" onPress={handleConfirm}>Tamam</Button>
        </View>
      </Surface>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: SPACING.md,
  },
  surface: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  container: {
    height: 300,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
    color: COLORS.text.secondary,
  },
  scrollView: {
    height: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
});

export default CustomDatePicker; 