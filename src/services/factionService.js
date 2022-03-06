import store from '../store/store.js';
import { updateFaction, deleteFaction, sortFactions, clearFactions, importFactions } from '../store/faction-reducer.js';
import Faction from '../models/Faction.js';
import EventEmitter from '../models/EventEmitter.js';
import FactionDisplay from '../components/FactionDisplay.js';
import * as linkService from './linkService.js';

/**
 * @prop {EventEmitter}
 */
const emitter = new EventEmitter();

/**
 * Get all factions.
 * @returns {Faction[]}
 */
const getAll = function () {
    const data = store.getState().factions;
    const factions = data.map((obj) => new Faction(obj));
    factions.forEach((faction) => {
        const links = linkService.getByTargetId(faction.id);
        links.forEach((link) => faction.addLink(link));
    });
    return factions;
};
/**
 * Get single faction.
 * @param {String} id
 * @returns {Faction|null}
 */
const getById = function (id) {
    const factions = store.getState().factions;
    const data = factions.find((el) => el.id === id);
    if (!data) {
        return null;
    }
    const faction = new Faction(data);
    const links = linkService.getByTargetId(faction.id);
    links.forEach((link) => faction.addLink(link));
    return faction;
};
/**
 * Save a new faction.
 * @param {String} mode view|edit
 * @param {Faction} faction
 * @returns {Faction}
 */
const create = function (mode = 'view', faction = null) {
    if (!(faction instanceof Faction)) {
        faction = new Faction({});
    }
    store.dispatch(updateFaction({ faction: faction.toJSON() }));
    emitter.trigger('faction:add', {
        item: faction,
        mode
    });
    return faction;
};

/**
 * Update a faction.
 * @param {Faction} faction
 */
const save = function (faction) {
    store.dispatch(updateFaction({ faction: faction.toJSON() }));
    emitter.trigger('faction:edit', {
        item: faction
    });
};

const remove = function (id) {
    store.dispatch(deleteFaction({ id }));
    emitter.trigger('faction:delete', {
        id
    });
    linkService.deleteByTargetId(id);
};

const sort = function (sortUuids) {
    store.dispatch(sortFactions({ sortUuids }));
};

/**
 * Delete all the factions at once.
 */
const deleteAll = function () {
    store.dispatch(clearFactions());
    // probably should trigger an event here?
};
/**
 * Import factions.
 * @param {Faction[]} factions
 */
const importAll = function (factions) {
    store.dispatch(importFactions({ factions }));
    factions.forEach((factionData) => {
        if (!factionData.id) {
            return;
        }
        const faction = new Faction(factionData);
        emitter.trigger('faction:add', {
            item: faction
        });
    });
};

const getDisplay = function () {
    return new FactionDisplay();
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
