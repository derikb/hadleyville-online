import store from '../store/store.js';
import { createNote, updateNote as updateNoteStore, deleteNote as deleteNoteStore, sortNotes as sortNotesStore, clearNotes, importNotes as importNotesStore } from '../store/notes-reducer.js';
import Note from '../models/note.js';
import EventEmitter from '../models/EventEmitter.js';

/**
 * @prop {EventEmitter}
 */
const noteEmitter = new EventEmitter();

/**
 * Get all notes.
 * @returns {Note[]}
 */
const getAllNotes = function () {
    const notes = store.getState().notes;
    return notes.map((obj) => new Note(obj));
};
/**
 * Get single note.
 * @param {String} id
 * @returns {Note|null}
 */
const getNoteById = function (id) {
    const notes = store.getState().notes;
    const data = notes.find((el) => el.uuid === id);
    if (data) {
        return new Note(data);
    }
    return null;
};
/**
 * Save a new note.
 * @param {Note} note
 * @param {String} mode view|edit
 * @returns {Note}
 */
const addNote = function (note, mode = 'view') {
    store.dispatch(createNote({ note: note.toJSON() }));
    noteEmitter.trigger('note:add', {
        note,
        mode
    });
    return note;
};

/**
 * Update a note.
 * @param {Note} note
 */
const updateNote = function (note) {
    store.dispatch(updateNoteStore({ note: note.toJSON() }));
    noteEmitter.trigger('note:edit', {
        note
    });
};

const deleteNote = function (uuid) {
    store.dispatch(deleteNoteStore({ uuid }));
    noteEmitter.trigger('note:delete', {
        id: uuid
    });
};

const sortNotes = function (sortUuids) {
    store.dispatch(sortNotesStore({ sortUuids }));
};

/**
 * Delete all the notes at once.
 */
const deleteAllNotes = function () {
    store.dispatch(clearNotes());
    // probably should trigger an event here?
};
/**
 * Import notes.
 * @param {Note[]} notes
 */
const importNotes = function (notes) {
    store.dispatch(importNotesStore({ notes }));
    notes.forEach((noteData) => {
        if (!noteData.uuid) {
            return;
        }
        const note = new Note(noteData);
        noteEmitter.trigger('note:add', {
            note
        });
    });
};

export {
    noteEmitter,
    getAllNotes,
    getNoteById,
    addNote,
    updateNote,
    sortNotes,
    deleteNote,
    deleteAllNotes,
    importNotes
};
