import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Capsule} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Capsule {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  openDate: string;
  createdAt: string;
  isLocked: boolean;
  recipientEmail?: string;
}

interface CapsuleState {
  items: Capsule[];
  loading: boolean;
  error: string | null;
}

const initialState: CapsuleState = {
  items: [],
  loading: false,
  error: null,
};

// Thunk'ın ismini değiştirdik
export const saveCapsule = createAsyncThunk(
  'capsules/save',
  async (capsule: Omit<Capsule, 'id'>) => {
    try {
      const existingCapsules = await AsyncStorage.getItem('capsules');
      const capsules = existingCapsules ? JSON.parse(existingCapsules) : [];

      const newCapsule = {
        ...capsule,
        id: Date.now().toString(),
      };

      capsules.push(newCapsule);
      await AsyncStorage.setItem('capsules', JSON.stringify(capsules));

      return newCapsule;
    } catch (error) {
      console.error('Kapsül kaydetme hatası:', error);
      throw error;
    }
  },
);

export const loadCapsules = createAsyncThunk('capsules/load', async () => {
  try {
    const capsules = await AsyncStorage.getItem('capsules');
    return capsules ? JSON.parse(capsules) : [];
  } catch (error) {
    console.error('Kapsüller yüklenirken hata:', error);
    throw error;
  }
});

const capsuleSlice = createSlice({
  name: 'capsules',
  initialState,
  reducers: {
    addCapsule: (state, action) => {
      state.items.push(action.payload);
    },
    removeCapsule: (state, action) => {
      state.items = state.items.filter(
        capsule => capsule.id !== action.payload,
      );
    },
    updateCapsule: (state, action) => {
      const index = state.items.findIndex(
        capsule => capsule.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCapsules.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCapsules.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCapsules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kapsüller yüklenemedi';
      })
      .addCase(saveCapsule.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(saveCapsule.rejected, (state, action) => {
        state.error = action.error.message || 'Kapsül eklenemedi';
      });
  },
});

export const {addCapsule, removeCapsule, updateCapsule} = capsuleSlice.actions;
export default capsuleSlice.reducer;
