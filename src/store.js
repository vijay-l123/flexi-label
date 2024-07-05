import { configureStore } from '@reduxjs/toolkit'
import LookupUpdate from './Redux/MasterDataUpdateSlice/LookupUpdate'
// ...

export const store = configureStore({
  reducer: {
    lookupDataFlags: LookupUpdate
  },
})
