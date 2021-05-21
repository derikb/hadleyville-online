import { createSlice } from '@reduxjs/toolkit';

const townSlice = createSlice({
    name: 'town',
    initialState: [
    ],
    reducers: {
        updateTown(state, action) {
            state.splice(0, 1, action.payload.town);
        }
    },
  })

  // Extract the action creators object and the reducer
  const { actions, reducer } = townSlice;
  // Extract and export each action creator by name
  export const { updateTown } = actions;
  // Export the reducer, either as a default or named export
  export default reducer;
