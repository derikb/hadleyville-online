import store from '../store/store.js';
import { updateRelationship, deleteRelationship, clearRelationships, importRelationships } from '../store/relationship-reducer.js';
import Relationship from '../models/relationship.js';
import EventEmitter from '../models/EventEmitter.js';

const emitter = new EventEmitter();

const getAll = function () {
    const relationships = store.getState().relationships;
    return relationships.map((obj) => {
        return new Relationship(obj);
    });
};

const getAllGroupedBySource = function () {
    const relations = getAll();
    const relMap = new Map();
    relations.forEach((rel) => {
        const source = rel.source || '';
        if (source && !relMap.get(rel.source)) {
            relMap.set(rel.source, [rel]);
        } else if (source) {
            const arr = relMap.get(rel.source);
            arr.push(rel);
            relMap.set(rel.source, arr);
        }
    });
    return relMap;
};

const getById = function (id) {
    const relationships = store.getState().relationships;
    const data = relationships.find((relationship) => {
        return relationship.id === id;
    });
    if (data) {
        return new Relationship(data);
    }
    return null;
};
/**
 * Get all relationships for a specific character.
 * @param {String} charId
 * @returns Relationship[]
 */
const getByCharacter = function (charId) {
    const relationships = getAll();
    return relationships.filter((relationship) => {
        return relationship.isCharacterInvolved(charId);
    });
};

const create = function (mode = 'view', relationship = null) {
    if (!(relationship instanceof Relationship)) {
        relationship = new Relationship({});
    }
    emitter.trigger('relationship:add', {
        item: relationship,
        mode
    });
    return relationship;
};

const save = function (relationship) {
    store.dispatch(updateRelationship({ relationship: relationship.toJSON() }));
    emitter.trigger('relationship:edit', {
        item: relationship
    });
};

const remove = function (id) {
    store.dispatch(deleteRelationship({ id }));
    emitter.trigger('relationship:delete', {
        id
    });
};

const sort = function (sortUuids) {
    // No sort for relationships
};

const deleteAll = function () {
    store.dispatch(clearRelationships());
};

const importAll = function (relationships) {
    store.dispatch(importRelationships({ relationships }));
    relationships.forEach((relationshipData) => {
        if (!relationshipData.id) {
            return;
        }
        const relationship = new Relationship(relationshipData);
        emitter.trigger('relationship:add', {
            item: relationship
        });
    });
};

const deleteByCharacter = function (uuid) {
    const relationships = getByCharacter(uuid);
    relationships.forEach((rel) => {
        remove(rel.uuid);
    });
};

export {
    emitter,
    getAll,
    getAllGroupedBySource,
    getById,
    getByCharacter,
    create,
    save,
    sort,
    remove,
    deleteAll,
    importAll,
    deleteByCharacter
};
