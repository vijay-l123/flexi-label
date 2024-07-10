import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tabValue: null,
}

const LabelUpdateSlice = createSlice({
    name: 'LabelUpdate',
    initialState: initialState,
    reducers: {
        setTabValues: (state, action) => {
            state.tabValue = action.payload
        }
    }
})

export const { setTabValues } = LabelUpdateSlice.actions;
export default LabelUpdateSlice.reducer;