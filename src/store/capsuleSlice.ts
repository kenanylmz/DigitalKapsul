import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {DatabaseService} from '../services/firebase/database';

export interface Capsule {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: 'text' | 'image' | 'video';
  capsuleType: 'self' | 'sent' | 'received';
  mediaUrl?: string;
  openDate: string;
  createdAt: string;
  isLocked: boolean;
  recipientEmail?: string;
  senderEmail?: string;
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
export const createCapsule = createAsyncThunk(
  'capsules/create',
  async (capsule: Omit<Capsule, 'id'>, {rejectWithValue}) => {
    try {
      const result = await DatabaseService.createCapsule(capsule);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kapsül oluşturulamadı');
    }
  },
);

export const loadCapsules = createAsyncThunk('capsules/load', async () => {
  return await DatabaseService.getUserCapsules();
});

export const updateCapsule = createAsyncThunk(
  'capsules/update',
  async (capsule: Capsule, {rejectWithValue}) => {
    try {
      const result = await DatabaseService.updateCapsule(capsule);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kapsül güncellenemedi');
    }
  },
);

export const deleteCapsule = createAsyncThunk(
  'capsules/delete',
  async (capsuleId: string, {rejectWithValue}) => {
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
  reducers: {},
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
