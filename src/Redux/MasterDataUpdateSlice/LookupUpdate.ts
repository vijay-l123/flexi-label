import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCreate: false,
    isEdit: false,
    lookupData: [],
    tabValue: null,
    populatedValue: null,
    isCreateNewVersion: false,
    editClickEvent: false,
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
        setEditClick: (state, action) => {
            state.editClickEvent = action.payload
        },
    }
})

export const { setIsCreate, setIsEdit, setLookupGridData, setTabValueRedux, setPopulatedValues, setCreateNewVersionRedux, setEditClick } = LookupDataFlagSlice.actions;
export default LookupDataFlagSlice.reducer;