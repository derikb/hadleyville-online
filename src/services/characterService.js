import store from '../store/store.js';
import { updateCharacter, deleteCharacter, clearCharacters, importCharacters } from '../store/character-reducer.js';

import pcSchema from '../models/pcSchema.js';
import { tableRoller } from '../services/randomTableService.js';
import { applySchemaToNPC } from '../../node_modules/rpg-table-randomizer/src/npc_generator';
import EventEmitter from '../models/EventEmitter.js';
import PC from '../models/pc.js';
import * as relationshipService from './relationshipService.js';
import * as relmapService from './relmapService.js';

const emitter = new EventEmitter();

const getAll = function (includeRelations = true) {
    const data = store.getState().characters;
    if (!data) {
        return [];
    }
    const pcs = data.map((obj) => {
        return new PC(obj);
    });
    if (!includeRelations) {
        return pcs;
    }
    const relations = relationshipService.getAllGroupedBySource();
    pcs.forEach((pc) => {
        const rels = relations.get(pc.id);
        if (rels) {
            pc.relationships = rels;
        }
    });
    return pcs;
};

const getCharacter = function (id = '', includeRelations = true) {
    let pc = null;
    if (id === '') {
        pc = new PC({});
        applySchemaToNPC(pcSchema, tableRoller, pc);
        return pc;
    }
    const data = store.getState().characters;
    if (!data) {
        return null;
    }
    const obj = data.find((pc) => {
        return pc.id === id;
    });
    if (!obj) {
        return null;
    }
    pc = new PC(obj);
    if (!includeRelations) {
        return pc;
    }
    // Only add relations the PC is the source of.
    const relations = relationshipService.getByCharacter(pc.id);
    relations.forEach((rel) => {
        if (rel.source === pc.id) {
            pc.relationships.push(rel);
        }
    });
    return pc;
};

const save = function (pc) {
    store.dispatch(updateCharacter({ pc: pc.toJSON() }));
    emitter.trigger('character:edit', {
        item: pc
    });
};

const remove = function (id) {
    store.dispatch(deleteCharacter({ id }));
    emitter.trigger('character:delete', {
        id
    });
    relationshipService.deleteByCharacter(id);
    relmapService.remove(id);
};

const deleteAll = function () {
    store.dispatch(clearCharacters());
};

const importAll = function (pcs) {
    store.dispatch(importCharacters({ pcs }));
};

export {
    emitter,
    getAll,
    getCharacter,
    save,
    remove,
    deleteAll,
    importAll
};
