import store from '../store/store.js';
import Name from '../models/Name.js';
import ModelTypes from '../models/ModelTypeConstants.js';
import Faction from '../models/Faction.js';
import NPC from '../models/npc.js';
import PC from '../models/pc.js';

/**
 * Don't use service to avoid loops with looking up links for npcs.
 * @returns Map<String, Name>
 */
const getNPCNames = function () {
    const data = store.getState().npcs;
    const names = new Map();
    data.forEach((object) => {
        const npc = new NPC(object);
        const name = new Name({
            uuid: npc.id,
            name: npc.name,
            type: ModelTypes.npc
        });
        names.set(npc.id, name);
    });
    return names;
};
/**
 * Don't use service to avoid loops with looking up links for pcs.
 * @returns Map<String, Name>
 */
const getPCNames = function () {
    const data = store.getState().characters;
    const names = new Map();
    data.forEach((object) => {
        const pc = new PC(object);
        const name = new Name({
            uuid: pc.id,
            name: pc.name,
            type: ModelTypes.pc
        });
        names.set(pc.id, name);
    });
    return names;
};
/**
 * Don't use service to avoid loops with looking up links for factions.
 * @returns Map<String, Name>
 */
const getFactionNames = function () {
    const data = store.getState().factions;
    const names = new Map();
    data.forEach((object) => {
        const faction = new Faction(object);
        const name = new Name({
            uuid: faction.id,
            name: faction.name,
            type: ModelTypes.faction
        });
        names.set(faction.id, name);
    });
    return names;
};

/**
 *
 * @returns Map<String, Name>
 */
const getAllNames = function () {
    const names = new Map(
        [
            ...getNPCNames(),
            ...getPCNames(),
            ...getFactionNames(),
            ...getNoteTitles()
        ]
    );
    return names;
};

/**
 *
 * @returns Map<String, Name>
 */
const getNoteTitles = function () {
    const data = store.getState().notes;
    const names = new Map();
    data.forEach((object) => {
        const name = new Name({
            uuid: object.uuid,
            name: object.title,
            type: ModelTypes.note
        });
        names.set(object.uuid, name);
    });
    return names;
};

/**
 *
 * @param {String} id Uuid
 * @param {String} type ModelTypeConstants
 * @returns {Name|null}
 */
const getNameById = function (id, type = '') {
    switch (type) {
        case 'npc':
            return getNPCNames().get(id);
        case 'pc':
            return getPCNames().get(id);
        case 'faction':
            return getFactionNames().get(id);
        case 'note':
            return getNoteTitles().get(id);
        default:
            return getAllNames().get(id);
    }
};

export {
    getAllNames,
    getNameById
};
