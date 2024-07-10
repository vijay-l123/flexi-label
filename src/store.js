import { configureStore } from '@reduxjs/toolkit'
import LookupUpdate from './Redux/MasterDataUpdateSlice/LookupUpdate'
import LabelUpdateSlice from './Redux/LabelUpdate/LabelUpdateSlice'
// ...

export const store = configureStore({
  reducer: {
    lookupDataFlags: LookupUpdate,
    LabelUpdate:LabelUpdateSlice
  },
})
