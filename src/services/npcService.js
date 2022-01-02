import store from '../store/store.js';
import { createNPC, updateNPC, deleteNPC, sortNPCs, clearNPCs, importNPCs } from '../store/npcs-reducer.js';

import npcSchema from '../models/npcSchema.js';
import NPC from '../models/npc.js';
import { convertToken } from '../services/randomTableService.js';
import { isEmpty } from '../../node_modules/rpg-table-randomizer/src/r_helpers.js';
import EventEmitter from '../models/EventEmitter.js';

const npcEmitter = new EventEmitter();

const newNPC = function () {
    const fields = new Map();
    npcSchema.fields.forEach((field) => {
        const key = field.key;
        if (!isEmpty(field.starting_value)) {
            fields.set(key, field.starting_value);
            return;
        }
        if (!isEmpty(field.source)) {
            if (field.type === 'array') {
                const value = [];
                const ct = (field.count) ? field.count : 1;
                for (let i = 0; i < ct; i++) {
                    value.push(convertToken(field.source));
                }
                fields.set(key, value);
            } else {
                fields.set(key, convertToken(field.source));
            }
            return;
        }
        fields.set(key, field.defaultEmpty);
    });
    return new NPC({
        fields: fields
    });
};

const getAllNPCs = function () {
    //const npcs = store.getState().npcs;
    // return npcs.map((obj) => {
    //     return new NPC(obj)
    // });
    return [
        newNPC(),
        newNPC()
    ];
};

const createNewNPC = function () {
    const npc = newNPC();
    // store.dispatch(createNPC({ npc: npc.toJSON() }));
    // this.npcs$.next(npc);
    return npc;
};

const getNPCById = function (id) {
    // const npcs = store.getState().npcs;
    const data = npcs.find((npc) => {
        return npc.id === id;
    })
    if (data) {
        return new NPC(data);
    }
    return null;
};

const updateNPC = function (npc) {
    // store.dispatch(updateNPC({ npc: npc.toJSON() }));
    // const upnpc = this.getNPCById(npc.id);
    // this.npcs$.next(upnpc);
};

const deleteNPC = function (id) {
    // store.dispatch(deleteNPC({ id }));
    // this.deletedNPCs$.next(uuid);
    npcEmitter.trigger('npc:delete', {
        id
    });
};

const sortNPCs = function (sortUuids) {
    // store.dispatch(sortNPCs({ sortUuids }));
};

const deleteAllNPCs = function () {
    // store.dispatch(clearNPCs());
};

const importNPCs = function (npcs) {
    // store.dispatch(importNPCs({ npcs }));
    npcs.forEach((npcData) => {
        if (!npcData.id) {
            return;
        }
        const npc = new NPC(npcData);
        this.npcs.push(npc);
        //this.npcs$.next(npc);
    });
};

export {
    npcEmitter,
    getAllNPCs,
    createNewNPC,
    updateNPC,
    deleteNPC,
    deleteAllNPCs,
    importNPCs
};
