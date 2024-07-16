import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tabValue: null,
    isCreateVersion: false,
}

const LabelUpdateSlice = createSlice({
    name: 'LabelUpdate',
    initialState: initialState,
    reducers: {
        setTabValues: (state, action) => {
            state.tabValue = action.payload
        },
        setNewVersion: (state, action) => {
            state.isCreateVersion = action.payload
        },
    }
})

export const { setTabValues, setNewVersion } = LabelUpdateSlice.actions;
export default LabelUpdateSlice.reducer;