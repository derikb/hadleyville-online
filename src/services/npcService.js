import store from '../store/store.js';
import { createNPC, updateNPC, deleteNPC, sortNPCs as sortNPCsStore, clearNPCs, importNPCs as importNPCsStore } from '../store/npcs-reducer.js';

import npcSchema from '../models/npcSchema.js';
import NPC from '../models/npc.js';
import { tableRoller } from '../services/randomTableService.js';
import { applySchemaToNPC } from '../../node_modules/rpg-table-randomizer/src/npc_generator';
import EventEmitter from '../models/EventEmitter.js';

const npcEmitter = new EventEmitter();

const getAllNPCs = function () {
    const npcs = store.getState().npcs;
    return npcs.map((obj) => {
        return new NPC(obj);
    });
};

const createNewNPC = function () {
    const npc = new NPC({});
    applySchemaToNPC(npcSchema, tableRoller, npc);
    store.dispatch(createNPC({ npc: npc.toJSON() }));
    return npc;
};

const getNPCById = function (id) {
    const npcs = store.getState().npcs;
    const data = npcs.find((npc) => {
        return npc.id === id;
    });
    if (data) {
        return new NPC(data);
    }
    return null;
};

const saveNPC = function (npc) {
    store.dispatch(updateNPC({ npc: npc.toJSON() }));
    const upnpc = this.getNPCById(npc.id);
    this.npcs$.next(upnpc);
};

const removeNPC = function (id) {
    store.dispatch(deleteNPC({ id }));
    npcEmitter.trigger('npc:delete', {
        id
    });
};

const sortNPCs = function (sortUuids) {
    store.dispatch(sortNPCsStore({ sortUuids }));
};

const deleteAllNPCs = function () {
    store.dispatch(clearNPCs());
};

const importNPCs = function (npcs) {
    store.dispatch(importNPCsStore({ npcs }));
    npcs.forEach((npcData) => {
        if (!npcData.id) {
            return;
        }
        const npc = new NPC(npcData);
        npcEmitter.trigger('npc:add', {
            npc
        });
    });
};

export {
    npcEmitter,
    getAllNPCs,
    getNPCById,
    createNewNPC,
    saveNPC,
    sortNPCs,
    removeNPC,
    deleteAllNPCs,
    importNPCs
};
