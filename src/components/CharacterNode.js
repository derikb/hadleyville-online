import Dragger from '../dragger.js';
import RelMapNode from '../models/relMapNode.js';
import A11yDialog from 'a11y-dialog/dist/a11y-dialog.esm';
import { save as saveMapNode } from '../services/relmapService.js';
import * as relationshipService from '../services/relationshipService.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
<style>
    :host {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid black;
        padding: .75rem;
        position: absolute;
        background-color: var(--surface1, white);
        border-radius: .5rem;
        z-index: 100;
    }

    :host * {
        box-sizing: border-box;
    }

    :host(.pc) {
        border-color: green;
        border-width: 2px;
    }

    :host(.npc) {
        border-color: var(--primary, black);
        border-width: 2px;
    }

    .body {
        display: flex;
        justify-content: space-between;
    }

    .job {
        font-size: .9rem;
    }
    .actions {
        margin-left: .5rem;
    }

    .factions {
        display: flex;
    }
    .factions span {
        height: 1.25rem;
        width: 1.25rem;
        border-radius: 1.25rem;
        margin-right: 0.5rem;
        font-size: .8rem;
        color: white;
        background-color: black;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<header></header>
<div class="body">
    <div class="job"></div>
    <div class="actions"><a href="">view</a></div>
</div>
<div class="factions"></div>
`;

/**
 * @prop {NPC|PC} char Associated Character.
 * @prop {CharacterLink[]} _sourceLinks Links that start with this Character.
 * @prop {CharacterLink[]} _targetLinks Links that end with this Character.
 * @prop {Relationship[]} _factions Factions relationship with this Character.
 */
class CharacterNode extends HTMLElement {
    constructor ({
        char = null
    }) {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.id_prefix = '';
        this._sourceLinks = [];
        this._targetLinks = [];
        this._factions = [];
        this.setItem(char);
    }

    connectedCallback () {
        this.enableDrag();

        this.shadowRoot.querySelector('.actions a').addEventListener('click', this._showModal.bind(this));

        relationshipService.emitter.on('relationship:delete', this._removeRelationship.bind(this));
        relationshipService.emitter.on('relationship:edit', this._addRelationship.bind(this));
    }

    disconnectedCallback () {
        this.disableDrag();
        this.shadowRoot.querySelector('.actions a').removeEventListener('click', this._showModal.bind(this));
    }

    get characterId () {
        return this.char.id;
    }

    /**
     *
     * @param {NPC|PC} char
     */
    setItem (char) {
        if (!char) {
            return;
        }
        this.char = char;
        this.id = `${this.id_prefix}_${this.characterId}`;
        this.dataset.id = this.characterId;
        this._setCharacterOutput();
    }

    _setCharacterOutput () {
        this.shadowRoot.querySelector('header').innerText = this.char.name;
        // Extend in child.
    }

    enableDrag () {
        this.dragger = new Dragger({
            dragElement: this,
            handleSelector: ''
        });
        this.dragger.enableDrag();
    }

    disableDrag () {
        this.dragger.disableDrag();
    }
    /**
     * @param {CharacterLink} link
     */
    addSourceLink (link) {
        const index = this._sourceLinks.findIndex((el) => {
            return el.linkId === link.linkId;
        });
        if (index >= 0) {
            return;
        }
        this._sourceLinks.push(link);
        link.startCoords = this.centerCoords;
    }
    /**
     * @param {CharacterLink} link
     */
    addTargetLink (link) {
        const index = this._targetLinks.findIndex((el) => {
            return el.linkId === link.linkId;
        });
        if (index >= 0) {
            return;
        }
        this._targetLinks.push(link);
        link.endCoords = this.boundingCoords;
    }
    /**
     * Update position of connected links.
     */
    updateLinks () {
        this._targetLinks.forEach((link) => {
            link.endCoords = this.boundingCoords;
        });
        this._sourceLinks.forEach((link) => {
            link.startCoords = this.centerCoords;
        });
    }
    /**
     * Width and height of node in pixels.
     * @returns {Number[]}
     */
    get size () {
        return [
            this.offsetWidth,
            this.offsetHeight
        ];
    }
    /**
     * Center of the node based on position to the parent.
     * @returns {Number[]}
     */
    get centerCoords () {
        const xOffset = this.offsetLeft;
        const yOffset = this.offsetTop;
        const [width, height] = this.size;

        return [
            xOffset + (width / 2),
            yOffset + (height / 2)
        ];
    }
    /**
     * Get x/y coords for node based on parent element positioning.
     * @returns {Number[]}
     */
    get coords () {
        return [
            this.offsetLeft,
            this.offsetTop
        ];
    }
    /**
     * Set coordinates, update any associated links.
     * @param {Number} x
     * @param {Number} y
     */
    set coords ([x, y]) {
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
        this.style.bottom = 'auto';
        this.style.right = 'auto';
        this.updateLinks();
    }
    /**
     * Get the current bounding coordinates of node.
     * @returns {Array[]} Coords for top left and bottom right.
     */
    get boundingCoords () {
        const [x, y] = this.coords;
        const [width, height] = this.size;
        return [
            [x, y],
            [x + width, y + height]
        ];
    }
    /**
     * After moving/placing, adjust if node is out of bounds of its parent.
     */
    adjustForParentBounds () {
        const parentWidth = this.parentNode.offsetWidth;
        const parentHeight = this.parentNode.offsetHeight;
        const [width, height] = this.size;
        // eslint-disable-next-line no-unused-vars
        const [[x1, y1], [x3, y3]] = this.boundingCoords;

        let update = false;
        let x = x1;
        let y = y1;
        // make sure it's not off the left or right
        if (x1 < 0) {
            x = 0;
            update = true;
        } else if (x3 > parentWidth) {
            x = parentWidth - width;
            update = true;
        }
        // and the top or bottom
        if (y1 < 0) {
            y = 0;
            update = true;
        } else if (y3 > parentHeight) {
            y = parentHeight - height;
            update = true;
        }
        if (update) {
            this.coords = [x, y];
        }
    }
    /**
     * Save current coords to the store.
     */
    saveCoords () {
        const [x, y] = this.coords;
        const n = new RelMapNode({
            uuid: this.characterId,
            x,
            y
        });
        saveMapNode(n);
    }

    _getDisplayElement () {
        // Set in child
        return null;
    }
    /**
     * Show modal for Character.
     * @param {Event} ev
     */
    _showModal (ev) {
        ev.preventDefault();
        const dialogEl = document.getElementById('dialog-char');
        const dialog = new A11yDialog(dialogEl);

        const dialogTitle = dialogEl.querySelector('#dialog-char-title');
        dialogTitle.innerHTML = this.char.name;

        const content = dialogEl.querySelector('.dialog-body');
        const displayEl = this._getDisplayElement();
        if (displayEl) {
            content.appendChild(displayEl);
        }

        dialog.on('hide', (element, event) => {
            content.innerHTML = '';
            dialogTitle.innerHTML = '';
            dialog.destroy();
        });
        dialog.show();
    }

    _addRelationship ({ item }) {
        this.char.addRelationship(item);
    }

    _removeRelationship ({ id }) {
        this.char.removeRelationship(id);
    }
    /**
     * Get contrasty color.
     * @param {String} hexcolor
     * @returns {String}
     */
    getContrast (hexcolor) {
        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }

        // Convert to RGB value
        const r = parseInt(hexcolor.substr(0,2),16);
        const g = parseInt(hexcolor.substr(2,2),16);
        const b = parseInt(hexcolor.substr(4,2),16);

        // Get YIQ ratio
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // Check contrast
        return (yiq >= 128) ? 'black' : 'white';
    }

    addFaction (faction, rel) {
        this._factions.push(rel);
        const span = document.createElement('span');
        span.style.backgroundColor = faction.color;
        span.style.color = this.getContrast(faction.color);
        span.innerText = rel.type;
        this.shadowRoot.querySelector('.factions')
            .appendChild(span);
    }
};

if (!window.customElements.get('had-nodechar')) {
    window.customElements.define('had-nodechar', CharacterNode);
}

export default CharacterNode;
