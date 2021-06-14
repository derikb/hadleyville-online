import { createSlice } from '@reduxjs/toolkit';


const npcsSlice = createSlice({
    name: 'npcs',
    initialState: [
    ],
    reducers: {
        createNPC(state, action) {
            const uuid = action.payload.npc.uuid;
            if (!uuid) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === uuid);
            // It's a dupe uuid... probably should throw an error or something...
            if (index > -1) {
                return;
            }
            state.push(action.payload.npc);
        },
        updateNPC(state, action) {
            const uuid = action.payload.npc.uuid;
            if (!uuid) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === uuid);
            if (index !== -1) {
                state.splice(index, 1, action.payload.npc);
            } else {
                state.push(action.payload.npc);
            }
        },
        deleteNPC(state, action) {
            const uuid = action.payload.uuid;
            if (!uuid) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === uuid);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
    },
  })

  // Extract the action creators object and the reducer
  const { actions, reducer } = npcsSlice;
  // Extract and export each action creator by name
  export const { createNPC, updateNPC, deleteNPC } = actions;
  // Export the reducer, either as a default or named export
  export default reducer;
