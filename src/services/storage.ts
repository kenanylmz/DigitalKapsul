import AsyncStorage from '@react-native-async-storage/async-storage';
import {Capsule} from '../types';

const CAPSULES_STORAGE_KEY = '@digital_capsule:capsules';

export const StorageService = {
  getCapsules: async (): Promise<Capsule[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(CAPSULES_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Kapsüller yüklenirken hata:', error);
      throw error;
    }
  },

  saveCapsules: async (capsules: Capsule[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(capsules);
      await AsyncStorage.setItem(CAPSULES_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Kapsüller kaydedilirken hata:', error);
      throw error;
    }
  },

  clearCapsules: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CAPSULES_STORAGE_KEY);
    } catch (error) {
      console.error('Kapsüller silinirken hata:', error);
      throw error;
    }
  },
}; 