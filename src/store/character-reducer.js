import { createSlice } from '@reduxjs/toolkit';

const characterSlice = createSlice({
    name: 'characters',
    initialState: [
    ],
    reducers: {
        updateCharacter (state, action) {
            const id = action.payload.pc.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            if (index !== -1) {
                state.splice(index, 1, action.payload.pc);
            } else {
                state.push(action.payload.pc);
            }
        },
        deleteCharacter (state, action) {
            const id = action.payload.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.id === id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        clearCharacters (state) {
            return [];
        },
        importCharacters (state, action) {
            const pcs = action.payload.pcs;
            pcs.forEach((pc) => {
                if (!pc.id) {
                    return;
                }
                const index = state.findIndex((el) => el.id === pc.id);
                if (index !== -1) {
                    state.splice(index, 1, pc);
                } else {
                    state.push(pc);
                }
            });
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer } = characterSlice;
// Extract and export each action creator by name
export const { updateCharacter, deleteCharacter, clearCharacters, importCharacters } = actions;
// Export the reducer, either as a default or named export
export default reducer;
