import { randomInteger } from 'rpg-table-randomizer/src/randomizer.js';
import { getAll as getAllPCs } from '../services/characterService.js';
import { getAll as getAllNPCs } from '../services/npcService.js';
import * as relationshipService from '../services/relationshipService.js';
import { getAll as getAllFactions } from '../services/factionService.js';
import { getAllNodes } from '../services/relmapService.js';
import NPCNode from './NPCNode.js';
import PCNode from './PCNode.js';
import PC from '../models/pc.js';
import CharacterLink from './CharacterLink.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
<style>
    :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
    }

    :host * {
        box-sizing: border-box;
    }

    :host > svg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    #npc-map {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .link-label {
        padding: .125rem .25rem;
        border-radius: .5rem;
        background-color: var(--surface1, rgba(255,255,255,0.5));
        position: absolute;
        z-index: 50;
    }
    .link-label .direction {
        display: inline-block;
    }

    svg line  {
        stroke: var(--primary, tan);
        stroke-width: 2px;
    }

    #factions-key {
        width: 100%;
        display: flex;
        z-index: 125;
        position: relative;
        background-color: var(--surface2);
        padding: .5rem;
        border-radius: .25rem;
    }
    #factions-key > div {
        margin-right: 2rem;
        font-weight: bold;
        display: flex;
        align-items: center;
    }
    .factionColor {
        display: inline-block;
        height: 1rem;
        width: 1rem;
        border-radius: 1rem;
        margin-left: 0.5rem;
    }
</style>
<div id="factions-key"><div>Factions:</div></div>
<div id="npc-map"></div>
<svg>
    <defs></defs>
</svg>
`;

/**
 * @prop {CharacterLink[]} links
 * @prop {CharacterNode[]} chars
 */
class RelationMap extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.npcArea = this.shadowRoot.querySelector('#npc-map');
        this.factionArea = this.shadowRoot.querySelector('#factions-key');
        this.svg = this.shadowRoot.querySelector('svg');

        this.chars = [];
        this.links = [];

        this.removeEvents = [];
        this.removeEvents.push(
            relationshipService.emitter.on('relationship:edit', this._addRelationship.bind(this))
        );
        this.removeEvents.push(
            relationshipService.emitter.on('relationship:delete', this._removeRelationship.bind(this))
        );
    }

    connectedCallback () {
        this._getAllNodes();
        this._getAllLinks();
        this.factions = getAllFactions();
        this.factions.forEach((faction) => {
            this.factionArea.insertAdjacentHTML(
                'beforeend',
                `<div>${faction.name} <span class="factionColor" style="background-color: ${faction.color};"></span></div>`
            );

            this._addFactionToNodes(faction);
        });
        // Add nodes to map, so we can calculate if the map goes over the viewport.
        this.chars.forEach((node) => {
            this._addCharacter(node);
        });

        // Get highest coordinates of nodes
        // and make the map that large if its smaller than the viewport.
        // make sure the parent node is set to let the map fill it.
        this.parentNode.style.height = '100%';
        this.parentNode.style.width = '100%';
        this.parentNode.style.overflow = 'auto';
        const [maxX, maxY] = this._getHighestCoords();
        let width = this.clientWidth;
        let height = this.clientHeight;
        if (width < maxX) {
            width = maxX;
        }
        if (height < maxY) {
            height = maxY;
        }
        this.npcArea.style.width = `${width}px`;
        this.npcArea.style.height = `${height}px`;
        this.svg.style.width = `${width}px`;
        this.svg.style.height = `${height}px`;
        this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Add links last...
        this.links.forEach((link) => {
            this.addLink(link);
        });
    }

    disconnectedCallback () {
        this.removeEvents.forEach((func) => {
            func();
        });
    }

    _getAllNodes () {
        const npcs = getAllNPCs();
        const pcs = getAllPCs();
        const nodes = getAllNodes();
        Array.prototype.concat(npcs, pcs).forEach((char) => {
            let charNode = null;
            if (char instanceof PC) {
                charNode = new PCNode({ char });
            } else {
                charNode = new NPCNode({ char });
            }
            const node = nodes.find((el) => {
                return el.uuid === charNode.characterId;
            });
            if (node) {
                charNode.coords = [node.x, node.y];
            } else {
                // randomize some coords if it wasn't placed already.
                charNode.coords = this.getRandomCoords();
            }
            this.chars.push(charNode);
        });
    }
    /**
     *
     * @param {Faction} faction
     */
    _addFactionToNodes (faction) {
        faction.relationships.forEach((rel) => {
            const charId = rel.getOther(faction.id);
            const char = this.chars.find((node) => node.characterId === charId);
            if (!char) {
                return;
            }
            char.addFaction(faction, rel);
        });
    }

    _getAllLinks () {
        const relationships = relationshipService.getAll();

        relationships.forEach((rel) => {
            const linkId = rel.mapLinkId;
            let link = this.links.find((el) => {
                return el.linkId === linkId;
            });
            if (!link) {
                link = new CharacterLink();
                this.links.push(link);
            }
            try {
                link.addRelationship(rel);
            } catch (e) {
                console.log(e.message);
            }
        });
    }

    getRandomCoords () {
        return [
            randomInteger(0, this.clientWidth),
            randomInteger(0, this.clientHeight)
        ];
    }

    _getHighestCoords () {
        let x = 0;
        let y = 0;

        this.chars.forEach((node) => {
            // eslint-disable-next-line no-unused-vars
            const [topleft, [x2, y2]] = node.boundingCoords;
            if (x2 > x) {
                x = x2;
            }
            if (y2 > y) {
                y = y2;
            }
        });
        return [x, y];
    }

    _addCharacter (char) {
        this.npcArea.appendChild(char);
    }
    /**
     *
     * @param {CharacterLink} link
     */
    addLink (link) {
        const sourceNode = this.chars.find((el) => {
            return el.characterId === link.start;
        });
        const targetNode = this.chars.find((el) => {
            return el.characterId === link.end;
        });
        if (!sourceNode || !targetNode) {
            return;
        }

        // Add these first, so the placement is right
        // They don't have offset values until inserted.
        this.svg.appendChild(link.element);
        this.npcArea.appendChild(link.labelElement);
        sourceNode.addSourceLink(link);
        targetNode.addTargetLink(link);
    }

    _addRelationship ({ item }) {
        const rel = item;
        const linkId = rel.mapLinkId;
        let link = this.links.find((el) => {
            return el.linkId === linkId;
        });
        if (link) {
            try {
                link.addRelationship(rel);
            } catch (e) {
                console.log(e.message);
            }
            link.updateLabelText();
            return;
        }
        link = new CharacterLink();
        link.addRelationship(rel);
        this.links.push(link);
        this.addLink(link);
    }

    _removeRelationship ({ id }) {
        const link = this.links.find((el) => {
            return el.isRelationshipIncluded(id);
        });
        if (!link) {
            return;
        }
        link.removeRelationship(id);
        if (!link.isLinkEmpty) {
            link.updateLabelText();
            return;
        }
        // remove it.
        const index = this.links.findIndex((el) => {
            return el === link;
        });
        this.links.splice(index, 1);
        link.removeLink();
    }

    /**
     * Detect if two nodes collided/overlapped.
     * @param {HTMLElement} node1
     * @param {HTMLElement} node2
     * @returns {Object} The closest edge where node1 collided with node2
     */
    // detectCollision (node1, node2) {
    //     if (node1.x + node1.width >= node2.x &&
    //         node1.x <= node2.x + node2.width &&
    //         node1.y + node1.height >= node2.y &&
    //         node1.y <= node2.y + node2.height) {
    //         const top_diff = node2.y + node2.height - node1.y;
    //         const bottom_diff = node1.y + node1.height - node2.y;
    //         const left_diff = node2.x + node2.width - node1.x;
    //         const right_diff = node1.x + node1.width - node2.x;

    //         const min = Math.min(bottom_diff, top_diff, left_diff, right_diff);

    //         return {
    //             bottom: bottom_diff === min,
    //             right: right_diff === min,
    //             left: left_diff === min,
    //             top: top_diff === min
    //         };
    //     }
    //     return null;
    // }
};

if (!window.customElements.get('had-maprelation')) {
    window.customElements.define('had-maprelation', RelationMap);
}

export default RelationMap;
