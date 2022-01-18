import Dragger from '../dragger.js';
import RelMapNode from '../models/relMapNode.js';
import A11yDialog from 'a11y-dialog/dist/a11y-dialog.esm';
import NPCDisplay from './npcdisplay.js';
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
        padding: 1rem;
        position: absolute;
        background-color: var(--surface1, white);
        border-radius: .5rem;
        z-index: 100;
    }

    :host * {
        box-sizing: border-box;
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
</style>
<header></header>
<div class="body">
    <div class="job"></div>
    <div class="actions"><a href="">view</a></div>
</div>
`;

/**
 * @prop {NPC} npc Associated NPC.
 * @prop {NPCLink[]} _sourceLinks Links that start with this NPC.
 * @prop {NPCLink[]} _targetLinks Links that end with this NPC.
 */
class NPCNode extends HTMLElement {
    constructor ({
        npc = null
    }) {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._sourceLinks = [];
        this._targetLinks = [];
        this.setItem(npc);
    }

    connectedCallback () {
        this.enableDrag();

        this.shadowRoot.querySelector('.actions a').addEventListener('click', this._showNPCModal.bind(this));

        relationshipService.emitter.on('relationship:delete', this._removeRelationship.bind(this));
        relationshipService.emitter.on('relationship:edit', this._addRelationship.bind(this));
    }

    disconnectedCallback () {
        this.disableDrag();
        this.shadowRoot.querySelector('.actions a').removeEventListener('click', this._showNPCModal.bind(this));
    }

    get characterId () {
        return this.npc.id;
    }

    /**
     *
     * @param {NPC} npc
     */
    setItem (npc) {
        if (!npc) {
            return;
        }
        this.npc = npc;
        this.id = `npc_${this.npc.id}`;
        this.dataset.id = this.npc.id;
        this._setNPCOutput();
    }

    _setNPCOutput () {
        this.shadowRoot.querySelector('header').innerText = this.npc.name;
        this.shadowRoot.querySelector('.body .job').innerHTML = `${this.npc.job}`;
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
     * @param {NPCLink} link
     */
    addSourceLink (link) {
        this._sourceLinks.push(link);
        link.startCoords = this.centerCoords;
    }
    /**
     * @param {NPCLink} link
     */
    addTargetLink (link) {
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
            uuid: this.npc.id,
            x,
            y
        });
        saveMapNode(n);
    }
    /**
     * Show modal for NPC.
     * @param {Event} ev
     */
    _showNPCModal (ev) {
        ev.preventDefault();
        const dialogEl = document.getElementById('dialog-npc');
        const dialog = new A11yDialog(dialogEl);

        const dialogTitle = dialogEl.querySelector('#dialog-npc-title');
        dialogTitle.innerHTML = this.npc.name;

        const npcDisplay = new NPCDisplay();
        npcDisplay.setItem(this.npc);

        const content = dialogEl.querySelector('.dialog-body');
        content.appendChild(npcDisplay);

        dialog.on('hide', (element, event) => {
            content.innerHTML = '';
            dialogTitle.innerHTML = '';
            dialog.destroy();
        });
        dialog.show();
    }

    _addRelationship ({ item }) {
        this.npc.addRelationship(item);
    }

    _removeRelationship ({ id }) {
        this.npc.removeRelationship(id);
    }
};

if (!window.customElements.get('had-nodenpc')) {
    window.customElements.define('had-nodenpc', NPCNode);
}

export default NPCNode;
