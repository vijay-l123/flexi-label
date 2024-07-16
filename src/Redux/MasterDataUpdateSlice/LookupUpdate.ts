import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCreate: false,
    isEdit: false,
    lookupData: [],
    tabValue: null,
    populatedValue: null,
    isCreateNewVersion: false
}

const LookupDataFlagSlice = createSlice({
    name: 'lookupDataFlags',
    initialState: initialState,
    reducers: {
        setIsCreate: (state, action) => {
            state.isCreate = action.payload
        },
        setIsEdit: (state, action) => {
            state.isEdit = action.payload
        },
        setLookupGridData: (state, action) => {
            state.lookupData = action.payload
        },
        setTabValueRedux: (state, action) => {
            state.tabValue = action.payload
        },
        setPopulatedValues: (state, action) => {
            state.populatedValue = action.payload
        },
        setCreateNewVersionRedux: (state, action) => {
            state.isCreateNewVersion = action.payload
        },
    }
})

export const { setIsCreate, setIsEdit, setLookupGridData, setTabValueRedux, setPopulatedValues, setCreateNewVersionRedux } = LookupDataFlagSlice.actions;
export default LookupDataFlagSlice.reducer;