import * as characterService from '../services/characterService.js';
import PCDisplay from '../components/pcdisplay.js';

/**
 * Event from PC Selector to switch what character is shown.
 * @param {CustomEvent} ev
 * @returns
 */
const switchCharacter = function (ev) {
    const id = ev.detail.id || '';
    const currentPc = document.querySelector('had-pc');
    if (currentPc) {
        // Is that one already loaded.
        if (currentPc.characterId === id) {
            return;
        }
        currentPc.parentNode.removeChild(currentPc);
    }
    const newPc = new PCDisplay();
    newPc.characterId = id;
    document.getElementById('pageContent').appendChild(newPc);
};

const removeCharacter = function ({ id }) {
    const currentPc = document.querySelector('had-pc');
    if (currentPc.characterId === id) {
        currentPc.parentNode.removeChild(currentPc);
    }
};

const loadCallback = function () {
    document.body.addEventListener('switchCharacter', switchCharacter);

    // If there is a hash, try to load a character.
    // Why not have this in the selector component?
    // Because the above event listener ends up being called
    // _After_ the selector is connected.
    const selector = document.querySelector('had-pc-selector');
    const hash = window.location.hash;
    if (hash === '') {
        return;
    }
    selector.value = hash.substring(1);

    characterService.emitter.on('character:delete', removeCharacter);
};

const unloadCallback = function () {
    document.body.removeEventListener('switchCharacter', switchCharacter);
    characterService.emitter.off('character:delete', removeCharacter);
};

export default {
    loadCallback,
    unloadCallback
};
