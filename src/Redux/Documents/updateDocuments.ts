import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import config from '../../Services/config';

const baseUrl = config.baseUrl;

// Define the structure of the update parameters
interface UpdateParams {
  fileId: string; // File ID of the document to be updated
  files: File[]; // Array of files to replace the existing document
}

// Define the structure of the update response
interface UpdateResponse {
  fileId: string; // ID of the updated file
}

// Define the initial state structure
interface DocumentUpdateState {
  updatedFileId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunk for updating documents
export const updateDocument = createAsyncThunk<UpdateResponse, UpdateParams, { rejectValue: string }>(
  'document/updateDocument',
  async (params, { rejectWithValue }) => {
    const { fileId, files } = params;
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('uploadFile', file);
    });

    formData.append('FileId', fileId);

    try {
      const response = await axios.post(`${baseUrl}Document/Updatefile`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      if (response.data && response.data !== 0) {
        return { fileId: response.data as string };
      } else {
        return rejectWithValue('Failed to update document. Invalid response.');
      }
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.message);
    }
  }
);

const initialState: DocumentUpdateState = {
  updatedFileId: null,
  status: 'idle',
  error: null,
};

const documentUpdateSlice = createSlice({
  name: 'documentUpdate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateDocument.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action: PayloadAction<UpdateResponse>) => {
        state.status = 'succeeded';
        state.updatedFileId = action.payload.fileId;
      })
      .addCase(updateDocument.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update document.';
      });
  },
});

export default documentUpdateSlice.reducer;
