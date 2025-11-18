// src/features/lookupData/lookupDataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../Services/config';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching lookup data with dynamic type parameter
export const fetchLookupDataAsync = createAsyncThunk('lookupData/fetchLookupData', async () => {
  // const response = await axios.get(`http://194.113.194.151:8080/LookUpData/GetAllLookupList`);
  const response = await axios.get(`${config.baseUrl}LookUpData/GetAllLookupList`);
  // console.log("response.data",response);
  
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
        // console.log("fetchLookupDataAsync - P",fetchLookupDataAsync);
        
        state.status = 'loading';
      })
      .addCase(fetchLookupDataAsync.fulfilled, (state, action) => {
                // console.log("fetchLookupDataAsync - F",fetchLookupDataAsync);
                // console.log("action.payload",action.payload);

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
