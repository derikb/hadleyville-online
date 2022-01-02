// import store from '../../../dist/store/store';
// import { createNote, updateNote, deleteNote, sortNotes, clearNotes, importNotes } from '../../../dist/store/notes-reducer.js';
import Note from '../models/note.js';

const getAllNotes = function () {
    // const notes = store.getState().notes;
    const notes = [
        { uuid: '12312', title: 'Test note', content: '- La - de - da' }
    ]
    return notes.map((obj) => new Note(obj));
};

const getNoteById = function (id) {
    // const notes = store.getState().notes;
    // const data = notes.find((el) => el.uuid === id );
    // if (data) {
    // return new Note(data);
    // }
    return null;
};

const addNote = function () {
    const note = new Note({});
    // store.dispatch(createNote({ note: note.toJSON() }));
    // this.notes$.next(note);
    return note;
};

const updateNote = function (note) {
    // store.dispatch(updateNote({ note: note.toJSON() }));
    // this.notes$.next(note);
};

const deleteNote = function (uuid) {
    // store.dispatch(deleteNote({ uuid }));
    // this.deletedNotes$.next(uuid);
};

const sortNotes = function (sortUuids) {
    // store.dispatch(sortNotes({ sortUuids }));
};

const deleteAllNotes = function () {
    // store.dispatch(clearNotes());
};

const importNotes = function (notes) {
    store.dispatch(importNotes({ notes }));
    notes.forEach((noteData) => {
        if (!noteData.uuid) {
            return;
        }
        const note = new Note(noteData);
        // this.notes$.next(note);
    });
};

// add an event emitter and export it so other models/etc can subscribe to events.

export {
    getAllNotes,
    getNoteById,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
    importNotes
};
