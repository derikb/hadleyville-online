import * as npcService from './npcService.js';
import * as characterService from './characterService.js';
import * as factionService from './factionService.js';
import Name from '../models/Name.js';
import ModelTypes from '../models/ModelTypeConstants.js';

/**
 *
 * @returns Map<String, Name>
 */
const getNPCNames = function () {
    const npcs = npcService.getAll();
    const names = new Map();
    npcs.forEach((npc) => {
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
 *
 * @returns Map<String, Name>
 */
const getPCNames = function () {
    const pcs = characterService.getAll();
    const names = new Map();
    pcs.forEach((pc) => {
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
 *
 * @returns Map<String, Name>
 */
const getFactionNames = function () {
    const factions = factionService.getAll();
    const names = new Map();
    factions.forEach((faction) => {
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
            ...getFactionNames()
        ]
    );
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
        default:
            return getAllNames().get(id);
    }
};

export {
    getAllNames,
    getNameById
};
