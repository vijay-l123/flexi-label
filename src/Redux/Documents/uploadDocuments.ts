import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


import config from '../../Services/config';

const baseUrl = config.baseUrl;

// Define TypeScript interfaces for the state
interface DocumentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  fileId: number | null;
}

interface UploadDocumentPayload {
  files: File[]; // Array of files for upload
}

// Initial state
const initialState: DocumentState = {
  isLoading: false,
  error: null,
  success: false,
  fileId: null,
};

// Create async thunk for uploading a document
export const uploadDocument = createAsyncThunk(
  'document/uploadDocument',
  async (payload: UploadDocumentPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append files to the form data with the key 'uploadFiles'
      payload.files.forEach((file) => {
        formData.append('uploadFiles', file);
      });

      const response = await axios.post(`${baseUrl}Document/Upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // Assuming the API returns the fileId or relevant data
    } catch (error: any) {
      return rejectWithValue(error.response.data || 'Failed to upload document');
    }
  }
);

// Create the document slice
const documentSlice = createSlice({
  name: 'documentUpload',
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.fileId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadDocument.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.success = true;
        state.fileId = action.payload;
      })
      .addCase(uploadDocument.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetState } = documentSlice.actions;

export default documentSlice.reducer;
