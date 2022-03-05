import { createSlice } from '@reduxjs/toolkit';

const linksSlice = createSlice({
    name: 'links',
    initialState: [
    ],
    reducers: {
        createLink (state, action) {
            const link = action.payload.link;
            const index = state.findIndex((el) => {
                return el.uuid === link.uuid && el.note_uuid === link.note_uuid;
            });
            // It's a dupe link... probably should throw an error or something...
            if (index > -1) {
                return;
            }
            state.push(action.payload.link);
        },
        deleteLink (state, action) {
            const link = action.payload.link;
            if (!link.uuid || !link.note_uuid) {
                return;
            }
            const index = state.findIndex((el) => {
                return el.uuid === link.uuid && el.note_uuid === link.note_uuid;
            });
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        clearLinks () {
            return [];
        },
        importLinks (state, action) {
            const links = action.payload.links;

            links.forEach((link) => {
                if (!link.uuid || !link.note_uuid) {
                    return;
                }
                const index = state.findIndex((el) => {
                    return el.uuid === link.uuid && el.note_uuid === link.note_uuid;
                });
                if (index !== -1) {
                    state.splice(index, 1, link);
                } else {
                    state.push(link);
                }
            });
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer } = linksSlice;
// Extract and export each action creator by name
export const { createLink, deleteLink, clearLinks, importLinks } = actions;
// Export the reducer, either as a default or named export
export default reducer;
