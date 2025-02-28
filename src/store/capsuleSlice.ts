import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {DatabaseService} from '../services/firebase/database';
import {Capsule, CapsuleCategory} from '../types';

export interface Capsule {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'text' | 'image' | 'video';
  category: CapsuleCategory;
  capsuleType: 'self' | 'sent' | 'received';
  mediaUrl?: string;
  openDate: string;
  createdAt: string;
  isLocked: boolean;
  recipientEmail?: string;
  senderEmail?: string;
  senderId?: string;
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

// Async thunks
export const createCapsule = createAsyncThunk<Capsule, Omit<Capsule, 'id'>>(
  'capsules/create',
  async (capsuleData, {rejectWithValue}) => {
    try {
      // Eksik alanları kontrol et
      if (
        !capsuleData.title ||
        !capsuleData.capsuleType ||
        !capsuleData.createdAt
      ) {
        throw new Error('Gerekli alanlar eksik');
      }

      // capsuleType kontrolü
      if (!['self', 'sent', 'received'].includes(capsuleData.capsuleType)) {
        throw new Error('Geçersiz kapsül tipi');
      }

      const result = await DatabaseService.createCapsule(capsuleData);
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Kapsül oluşturulurken bir hata oluştu',
      );
    }
  },
);

export const loadCapsules = createAsyncThunk<Capsule[], void>(
  'capsules/load',
  async (_, {rejectWithValue}) => {
    try {
      const capsules = await DatabaseService.getUserCapsules();
      return capsules;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kapsüller yüklenemedi');
    }
  },
);

export const updateCapsule = createAsyncThunk<Capsule, Capsule>(
  'capsules/update',
  async (capsule, {rejectWithValue}) => {
    try {
      const result = await DatabaseService.updateCapsule(capsule);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kapsül güncellenemedi');
    }
  },
);

export const deleteCapsule = createAsyncThunk<string, string>(
  'capsules/delete',
  async (capsuleId, {rejectWithValue}) => {
    try {
      await DatabaseService.deleteCapsule(capsuleId);
      return capsuleId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kapsül silinemedi');
    }
  },
);

const capsuleSlice = createSlice({
  name: 'capsules',
  initialState,
  reducers: {
    // Gerekirse burada senkron reducer'lar eklenebilir
  },
  extraReducers: builder => {
    builder
      // Load capsules
      .addCase(loadCapsules.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCapsules.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(loadCapsules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kapsüller yüklenemedi';
      })
      // Create capsule
      .addCase(createCapsule.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCapsule.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createCapsule.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Kapsül oluşturulamadı';
      })
      // Update capsule
      .addCase(updateCapsule.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCapsule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          item => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCapsule.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Kapsül güncellenemedi';
      })
      // Delete capsule
      .addCase(deleteCapsule.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCapsule.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCapsule.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Kapsül silinemedi';
      });
  },
});

export default capsuleSlice.reducer;
