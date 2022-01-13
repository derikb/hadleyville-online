import store from '../store/store.js';
import { createNPC, updateNPC, deleteNPC, sortNPCs, clearNPCs, importNPCs } from '../store/npcs-reducer.js';

import npcSchema from '../models/npcSchema.js';
import NPC from '../models/npc.js';
import { tableRoller } from '../services/randomTableService.js';
import { applySchemaToNPC } from '../../node_modules/rpg-table-randomizer/src/npc_generator';
import EventEmitter from '../models/EventEmitter.js';
import NPCDisplay from '../components/npcdisplay.js';

const emitter = new EventEmitter();

const getAll = function () {
    const npcs = store.getState().npcs;
    return npcs.map((obj) => {
        return new NPC(obj);
    });
};

const getById = function (id) {
    const npcs = store.getState().npcs;
    const data = npcs.find((npc) => {
        return npc.id === id;
    });
    if (data) {
        return new NPC(data);
    }
    return null;
};

const create = function (mode = 'view', npc = null) {
    if (!(npc instanceof NPC)) {
        npc = new NPC({});
        applySchemaToNPC(npcSchema, tableRoller, npc);
    }
    store.dispatch(createNPC({ npc: npc.toJSON() }));
    emitter.trigger('npc:add', {
        item: npc,
        mode
    });
    return npc;
};

const save = function (npc) {
    store.dispatch(updateNPC({ npc: npc.toJSON() }));
    emitter.trigger('npc:edit', {
        item: npc
    });
};

const remove = function (id) {
    store.dispatch(deleteNPC({ id }));
    emitter.trigger('npc:delete', {
        id
    });
};

const sort = function (sortUuids) {
    store.dispatch(sortNPCs({ sortUuids }));
};

const deleteAll = function () {
    store.dispatch(clearNPCs());
};

const importAll = function (npcs) {
    store.dispatch(importNPCs({ npcs }));
    npcs.forEach((npcData) => {
        if (!npcData.id) {
            return;
        }
        const npc = new NPC(npcData);
        emitter.trigger('npc:add', {
            item: npc
        });
    });
};

const getDisplay = function () {
    return new NPCDisplay();
};

export {
    emitter,
    getAll,
    getById,
    create,
    save,
    sort,
    remove,
    deleteAll,
    importAll,
    getDisplay
};
