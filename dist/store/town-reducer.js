import { createSlice } from '../../node_modules/@reduxjs/toolkit/dist/index.js';

const townSlice = createSlice({
    name: 'town',
    initialState: [
    ],
    reducers: {
        updateTown(state, action) {
            state.splice(0, 1, action.payload.town);
        },
        clearTown() {
            return [];
        }
    },
  })

  // Extract the action creators object and the reducer
  const { actions, reducer } = townSlice;
  // Extract and export each action creator by name
  export const { updateTown, clearTown } = actions;
  // Export the reducer, either as a default or named export
  export default reducer;
