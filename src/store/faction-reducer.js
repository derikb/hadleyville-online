import { createSlice } from '@reduxjs/toolkit';

const factionsSlice = createSlice({
    name: 'factions',
    initialState: [
    ],
    reducers: {
        updateFaction (state, action) {
            const id = action.payload.faction.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            if (index !== -1) {
                state.splice(index, 1, action.payload.faction);
            } else {
                state.push(action.payload.faction);
            }
        },
        deleteFaction (state, action) {
            const id = action.payload.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        sortFactions (state, action) {
            // Array of ids in new order.
            const sortids = action.payload.sortids;
            if (!Array.isArray(sortids) || sortids.length === 0) {
                return;
            }
            state.sort((a, b) => {
                const aIndex = sortids.indexOf(a.id);
                const bIndex = sortids.indexOf(b.id);
                return aIndex - bIndex;
            });
        },
        clearFactions () {
            return [];
        },
        importFactions (state, action) {
            const factions = action.payload.factions;

            factions.forEach((faction) => {
                if (!faction.id) {
                    return;
                }
                const index = state.findIndex((el) => el.id === faction.id);
                if (index !== -1) {
                    state.splice(index, 1, faction);
                } else {
                    state.push(faction);
                }
            });
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer } = factionsSlice;
// Extract and export each action creator by name
export const { updateFaction, deleteFaction, sortFactions, clearFactions, importFactions } = actions;
// Export the reducer, either as a default or named export
export default reducer;
