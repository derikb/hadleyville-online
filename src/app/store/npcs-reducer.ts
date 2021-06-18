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
        sortNPCs(state, action) {
            // Array of UUIDs in new order.
            const sortUuids = action.payload.sortUuids;
            if (!Array.isArray(sortUuids) || sortUuids.length === 0) {
                return;
            }
            state.sort((a, b) => {
                const aIndex = sortUuids.indexOf(a.uuid);
                const bIndex = sortUuids.indexOf(b.uuid);
                return aIndex - bIndex;
            });
        }
    },
  })

  // Extract the action creators object and the reducer
  const { actions, reducer } = npcsSlice;
  // Extract and export each action creator by name
  export const { createNPC, updateNPC, deleteNPC, sortNPCs } = actions;
  // Export the reducer, either as a default or named export
  export default reducer;
