import { createSlice } from '@reduxjs/toolkit';

const relMapSlice = createSlice({
    name: 'relmap',
    initialState: [
    ],
    reducers: {
        updateNode (state, action) {
            const uuid = action.payload.node.uuid;
            if (!uuid) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === uuid);
            if (index !== -1) {
                state.splice(index, 1, action.payload.node);
            } else {
                state.push(action.payload.node);
            }
        },
        deleteNode (state, action) {
            const uuid = action.payload.uuid;
            if (!uuid) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === uuid);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        clearNodes () {
            return [];
        },
        importNodes (state, action) {
            const nodes = action.payload.nodes;

            nodes.forEach((node) => {
                if (!node.uuid) {
                    return;
                }
                const index = state.findIndex((el) => el.uuid === node.uuid);
                if (index !== -1) {
                    state.splice(index, 1, node);
                } else {
                    state.push(node);
                }
            });
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer } = relMapSlice;
// Extract and export each action creator by name
export const { updateNode, deleteNode, clearNodes, importNodes } = actions;
// Export the reducer, either as a default or named export
export default reducer;
