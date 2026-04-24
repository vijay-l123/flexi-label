// src/features/lookupData/lookupDataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../Services/config';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchLookupDataAsync = createAsyncThunk('lookupData/fetchLookupData', async () => {
  const response = await axios.get(`${config.baseUrl}LookUpData/GetAllLookupList`);
  
  return response.data.data;
});

const lookupDataSlice = createSlice({
  name: 'fetchGetLookupData',
  initialState,
  reducers: {
    resetLookupData: (state) => {
        state.data = [];
        state.status = 'idle';
        state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLookupDataAsync.pending, (state) => {
        
        state.status = 'loading';
      })
      .addCase(fetchLookupDataAsync.fulfilled, (state, action) => {

        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLookupDataAsync.rejected, (state, action) => {
                // console.log("fetchLookupDataAsync - P",fetchLookupDataAsync);

        state.status = 'failed';
      });
  },
});

export const { resetLookupData } = lookupDataSlice.actions;
export default lookupDataSlice.reducer;
