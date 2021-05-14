import { createSlice } from '@reduxjs/toolkit';


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
            const uuid = action.payload.uuid;
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
    },
  })

  // Extract the action creators object and the reducer
  const { actions, reducer } = notesSlice;
  // Extract and export each action creator by name
  export const { createNote, updateNote, deleteNote } = actions;
  // Export the reducer, either as a default or named export
  export default reducer;
