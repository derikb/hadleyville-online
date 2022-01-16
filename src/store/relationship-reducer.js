import { createSlice } from '@reduxjs/toolkit';

const relationshipsSlice = createSlice({
    name: 'relationships',
    initialState: [
    ],
    reducers: {
        createRelationship (state, action) {
            const id = action.payload.relationship.uuid;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === id);
            // It's a dupe uuid... probably should throw an error or something...
            if (index > -1) {
                return;
            }
            state.push(action.payload.relationship);
        },
        updateRelationship (state, action) {
            const id = action.payload.relationship.uuid;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === id);
            if (index !== -1) {
                state.splice(index, 1, action.payload.relationship);
            } else {
                state.push(action.payload.relationship);
            }
        },
        deleteRelationship (state, action) {
            const id = action.payload.id;
            if (!id) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === id);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        clearRelationships (state) {
            return [];
        },
        importRelationships (state, action) {
            const relationships = action.payload.relationships;

            relationships.forEach((relationship) => {
                if (!relationship.uuid) {
                    return;
                }
                const index = state.findIndex((el) => el.uuid === relationship.uuid);
                if (index !== -1) {
                    state.splice(index, 1, relationship);
                } else {
                    state.push(relationship);
                }
            });
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer } = relationshipsSlice;
// Extract and export each action creator by name
export const { createRelationship, updateRelationship, deleteRelationship, sortRelationships, clearRelationships, importRelationships } = actions;
// Export the reducer, either as a default or named export
export default reducer;
