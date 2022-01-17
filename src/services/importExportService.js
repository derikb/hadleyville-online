import store from '../store/store';
import { importAll as importNotes, deleteAll as deleteAllNotes } from './notesService.js';
import { save as saveTown, clear as clearTown } from './townService.js';
import { importAll as importNPCs, deleteAll as deleteAllNPCs } from './npcService.js';
import { importAll as importRelationships, deleteAll as deleteAllRelationships } from './relationshipService.js';
import { importAll as importMapNodes, deleteAll as deleteMapNodes } from './relmapService.js';
import { Town } from '../models/town.js';

/**
 * Reset UI after downloading export.
 * @param {Event} ev
 */
const resetExport = function (ev) {
    // Give it a second so the link default action happens.
    // Then we revoke the object url to clear memory.
    setTimeout(() => {
        window.URL.revokeObjectURL(ev.target.href);
        document.getElementById('export-output').innerHTML = '';
        document.getElementById('export-button').hidden = false;
    }, 1000);
};

/**
 * Export date.
 * @param {Event} event
 */
const doExport = function (event) {
    const data = store.getState();
    const date = new Date();
    const file = new Blob([JSON.stringify(data)], { type: 'application/json' });
    // Object url must be unsanitized else it doesn't work.
    const exportFileUrl = URL.createObjectURL(file);
    const exportFileName = `Hadleyville__${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;

    const link = document.createElement('a');
    link.href = exportFileUrl;
    link.setAttribute('download', exportFileName);
    link.innerText = 'Download Export';
    link.addEventListener('click', resetExport);
    document.getElementById('export-output').appendChild(link);
    document.getElementById('export-button').hidden = true;
};

/**
 * Import from an export.
 * @param {Event} ev
 */
const doImport = function (ev) {
    ev.preventDefault();
    const form = ev.target;
    const input_file = form.querySelector('input[type=file]');
    if (!input_file.files) {
        return;
    }
    Array.from(input_file.files).forEach((f) => {
        const reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = ((theFile) => {
            return (e) => {
                let data = {};
                try {
                    data = JSON.parse(e.target.result);
                } catch (err) {
                    return;
                }
                const notes = data.notes || [];
                if (notes && Array.isArray(notes) && notes.length > 0) {
                    importNotes(notes);
                }
                const npcs = data.npcs || [];
                if (npcs && Array.isArray(npcs) && npcs.length > 0) {
                    importNPCs(npcs);
                }
                const towns = data.town || [];
                if (Array.isArray(towns)) {
                    const town = towns.find(Boolean);
                    if (town && town.id) {
                        saveTown(new Town(town));
                    }
                }
                const relationships = data.relationships || [];
                if (relationships && Array.isArray(relationships) && relationships.length > 0) {
                    importRelationships(relationships);
                }
                const nodes = data.relmap || [];
                if (nodes && Array.isArray(nodes) && nodes.length > 0) {
                    importMapNodes(nodes);
                }
            };
        })(f);
        reader.readAsText(f);
    });

    // clear form.
    input_file.value = '';
};

/**
 * Remove all npcs, notes, and clear the town.
 * @param {Event} ev
 */
const deleteAll = function (ev) {
    if (!confirm('Are you really sure?')) {
        return;
    }
    deleteAllNotes();
    deleteAllRelationships();
    deleteMapNodes();
    deleteAllNPCs();
    clearTown();
};

/**
 * Setup actions on the settings page.
 */
const setupPage = function () {
    const exportButton = document.getElementById('btn-export');
    exportButton.addEventListener('click', doExport);

    const importForm = document.getElementById('importForm');
    importForm.addEventListener('submit', doImport);

    const deleteButton = document.getElementById('btn-delete');
    deleteButton.addEventListener('click', deleteAll);
};

export {
    setupPage
};
