// import store from '../store/store';
import { importNotes, deleteAllNotes } from '../services/notesService.js';
import { saveTown, clearTown } from '../models/town.js';
import { importNPCs, deleteAllNPCs } from '../services/npcService.js';

const resetExport = function (ev) {
    // Give it a second so the link default action happens.
    // Then we revoke the object url to clear memory.
    setTimeout(() => {
        window.URL.revokeObjectURL(ev.target.href);
        document.getElementById('export-output').innerHTML = '';
        document.getElementById('export-button').hidden = false;
    }, 1000);
};

const doExport = function (event) {
    console.log(event);

    // const data = store.getState();
    const data = {};
    const date = new Date();
    const file = new Blob([JSON.stringify(data)], { type: 'application/json' });
    // Object url must be unsanitized else it doesn't work.
    const exportFileUrl = URL.createObjectURL(file);
    const exportFileName = `Hadleyville__${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;

    const link = document.createElement('a');
    link.href = exportFileUrl;
    link.setAttribute('download', exportFileName);
    link.innerText = 'Download Export';
    link.addEventListener('click', (ev) => {
        resetExport();
    });
    document.getElementById('export-output').appendChild(link);
    document.getElementById('export-button').hidden = true;
};

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
                    if (town && town.uuid) {
                        saveTown(town);
                    }
                }
            };
        })(f);
        reader.readAsText(f);
    });

    // clear form.
    input_file.value = '';
};

const deleteAll = function (ev) {
    if (!confirm('Are you really sure?')) {
        return;
    }

    deleteAllNotes();
    deleteAllNPCs();
    clearTown();
};

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
