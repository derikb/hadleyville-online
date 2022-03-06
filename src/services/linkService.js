import store from '../store/store.js';
import { createLink, deleteLink, clearLinks, importLinks } from '../store/link-reducer.js';
import NoteLink from '../models/NoteLink.js';
import EventEmitter from '../models/EventEmitter.js';
import { getAllNames, getNameById } from './nameService.js';

/**
 * @prop {EventEmitter}
 */
const emitter = new EventEmitter();

const getNameForLink = function (link) {
    const name = getNameById(link.uuid, link.type);
    if (name) {
        link.title = name.name;
    }
};

const getNameForLinks = function (links) {
    const names = getAllNames();
    links.forEach((link) => {
        const name = names.get(link.uuid);
        if (name) {
            link.title = name.name;
        }
        const noteTitle = names.get(link.note_uuid);
        if (noteTitle) {
            link.note_title = noteTitle.name;
        }
    });
};

/**
 * Get all links.
 * @returns {NoteLink[]}
 */
const getAll = function () {
    const data = store.getState().links;
    const links = data.map((obj) => {
        return new NoteLink(obj);
    });
    getNameForLinks(links);
    return links;
};
/**
 * Get links by note.
 * @param {String} note_uuid
 * @returns {NoteLink[]}
 */
const getByNoteId = function (note_uuid) {
    const objects = store.getState().links.filter((el) => el.note_uuid === note_uuid);
    const links = objects.map((obj) => new NoteLink(obj));
    getNameForLinks(links);
    return links;
};

/**
 * Get links by target (npc, pc, faction, etc.).
 * @param {String} uuid
 * @returns {NoteLink[]}
 */
const getByTargetId = function (uuid) {
    const objects = store.getState().links.filter((el) => el.uuid === uuid);
    const links = objects.map((obj) => new NoteLink(obj));
    getNameForLinks(links);
    return links;
};

/**
 * Save a new link.
 * @param {NoteLink} link
 * @returns {NoteLink}
 */
const create = function (link = null) {
    if (!(link instanceof NoteLink)) {
        link = new NoteLink({});
    }
    store.dispatch(createLink({ link: link.toJSON() }));
    emitter.trigger('link:add', {
        item: link
    });
    return link;
};

const remove = function (link) {
    store.dispatch(deleteLink({ link: link.toJSON() }));
    emitter.trigger('link:delete', {
        uuid: link.uuid,
        note_uuid: link.note_uuid
    });
};

const deleteByNoteId = function (note_uuid) {
    const links = getByNoteId(note_uuid);
    links.forEach((link) => {
        remove(link);
    });
};

const deleteByTargetId = function (uuid) {
    const links = getByTargetId(uuid);
    links.forEach((link) => {
        remove(link);
    });
};

/**
 * Delete all the links at once.
 */
const deleteAll = function () {
    store.dispatch(clearLinks());
    // probably should trigger an event here?
};
/**
 * Import links.
 * @param {NoteLink[]} links
 */
const importAll = function (links) {
    store.dispatch(importLinks({ links }));
    links.forEach((linkData) => {
        if (!linkData.uuid) {
            return;
        }
        const link = new NoteLink(linkData);
        getNameForLink(link);
        emitter.trigger('link:add', {
            item: link
        });
    });
};

export {
    emitter,
    getAll,
    getByNoteId,
    getByTargetId,
    create,
    // save,
    remove,
    deleteByNoteId,
    deleteByTargetId,
    deleteAll,
    importAll
};
