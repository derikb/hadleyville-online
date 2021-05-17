import { createSlice } from '@reduxjs/toolkit';


const npcsSlice = createSlice({
    name: 'npcs',
    initialState: [
    ],
    reducers: {
        createNPC(state, action) {
            console.log(action);
            const id = action.payload.npc.id;
            const index = state.findIndex((el) => el.id === id);
            // It's a dupe uuid... probably should throw an error or something...
            if (index > -1) {
                return;
            }
            state.push(action.payload.npc);
        },
        updateNPCFields(state, action) {
            const id = action.payload.id;
            if (!id) {
                return;
            }
            const npc = state.find((el) => el.id === id);
            if (!npc) {
                return;
            }
            npc.fields = action.payload.fields;
        },
        updateNPC(state, action) {
            const id = action.payload.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            if (index !== -1) {
                state.splice(index, 1, action.payload.npc);
            } else {
                state.push(action.payload.npc);
            }
        },
        deleteNPC(state, action) {
            const id = action.payload.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
    },
  })

  // Extract the action creators object and the reducer
  const { actions, reducer } = npcsSlice;
  // Extract and export each action creator by name
  export const { createNPC, updateNPCFields, updateNPC, deleteNPC } = actions;
  // Export the reducer, either as a default or named export
  export default reducer;
