import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Capsule} from '../types';
import {StorageService} from '../services/storage';

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
export const fetchCapsules = createAsyncThunk(
  'capsules/fetchCapsules',
  async () => {
    return await StorageService.getCapsules();
  },
);

export const addCapsuleAsync = createAsyncThunk(
  'capsules/addCapsuleAsync',
  async (capsule: Capsule) => {
    try {
      const response = await StorageService.getCapsules();
      const capsules = response || [];
      const updatedCapsules = [...capsules, capsule];
      await StorageService.saveCapsules(updatedCapsules);
      return capsule;
    } catch (error) {
      console.error('Kapsül eklenirken hata:', error);
      throw error;
    }
  },
);

const capsuleSlice = createSlice({
  name: 'capsules',
  initialState,
  reducers: {
    addCapsule: (state, action: PayloadAction<Capsule>) => {
      state.items.push(action.payload);
    },
    removeCapsule: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        capsule => capsule.id !== action.payload,
      );
      StorageService.saveCapsules(state.items);
    },
    updateCapsule: (state, action: PayloadAction<Capsule>) => {
      const index = state.items.findIndex(
        capsule => capsule.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
        StorageService.saveCapsules(state.items);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCapsules.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCapsules.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCapsules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kapsüller yüklenemedi';
      })
      .addCase(addCapsuleAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addCapsuleAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Kapsül eklenemedi';
      });
  },
});

export const {addCapsule, removeCapsule, updateCapsule} = capsuleSlice.actions;
export default capsuleSlice.reducer;
