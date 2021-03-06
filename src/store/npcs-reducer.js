import { createSlice } from '@reduxjs/toolkit';

const npcsSlice = createSlice({
    name: 'npcs',
    initialState: [
    ],
    reducers: {
        createNPC (state, action) {
            const id = action.payload.npc.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            // It's a dupe uuid... probably should throw an error or something...
            if (index > -1) {
                return;
            }
            state.push(action.payload.npc);
        },
        updateNPC (state, action) {
            const id = action.payload.npc.id;
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
        deleteNPC (state, action) {
            const id = action.payload.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        sortNPCs (state, action) {
            // Array of UUIDs in new order.
            const sortUuids = action.payload.sortUuids;
            if (!Array.isArray(sortUuids) || sortUuids.length === 0) {
                return;
            }
            state.sort((a, b) => {
                const aIndex = sortUuids.indexOf(a.id);
                const bIndex = sortUuids.indexOf(b.id);
                return aIndex - bIndex;
            });
        },
        clearNPCs (state) {
            return [];
        },
        importNPCs (state, action) {
            const npcs = action.payload.npcs;

            npcs.forEach((npc) => {
                if (!npc.id) {
                    return;
                }
                const index = state.findIndex((el) => el.id === npc.id);
                if (index !== -1) {
                    state.splice(index, 1, npc);
                } else {
                    state.push(npc);
                }
            });
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer } = npcsSlice;
// Extract and export each action creator by name
export const { createNPC, updateNPC, deleteNPC, sortNPCs, clearNPCs, importNPCs } = actions;
// Export the reducer, either as a default or named export
export default reducer;
