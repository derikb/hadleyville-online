import { createSlice } from '../../node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js';


const notesSlice = createSlice({
    name: 'notes',
    initialState: [
    ],
    reducers: {
        createNote(state, action) {
            console.log(action);
            const uuid = action.payload.note.uuid;
            const index = state.findIndex((el) => el.uuid === uuid);
            // It's a dupe uuid... probably should throw an error or something...
            if (index > -1) {
                return;
            }
            state.push(action.payload.note);
        },
        updateNote(state, action) {
            const uuid = action.payload.note.uuid;
            if (!uuid) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === uuid);
            if (index !== -1) {
                state.splice(index, 1, action.payload.note);
            } else {
                state.push(action.payload.note);
            }
        },
        deleteNote(state, action) {
            const uuid = action.payload.uuid;
            if (!uuid) {
                return;
            }
            const index = state.findIndex((el) => el.uuid === uuid);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        sortNotes(state, action) {
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
        },
        clearNotes() {
            return [];
        },
        importNotes(state, action) {
            const notes = action.payload.notes;

            notes.forEach((note) => {
                if (!note.uuid) {
                    return;
                }
                const index = state.findIndex((el) => el.uuid === note.uuid);
                if (index !== -1) {
                    state.splice(index, 1, note);
                } else {
                    state.push(note);
                }
            });
        }
    },
  })

  // Extract the action creators object and the reducer
  const { actions, reducer } = notesSlice;
  // Extract and export each action creator by name
  export const { createNote, updateNote, deleteNote, sortNotes, clearNotes, importNotes } = actions;
  // Export the reducer, either as a default or named export
  export default reducer;
