/**
 * Links between Characters on the relaionship map.
 * This can accomodate 1 or 2 Relationship models.
 * It has two elements (one is SVG), so it can't be a web component, at least the SVG can't.
 * @prop {Relationship[]} relations 1 or 2 Relatinships.
 * @prop {String} _start uuid for start of line node (based on first relationship added)
 * @prop {String} _end uuid for end of line node (based on first relationship added)
 */
export default class CharacterLink {
    constructor () {
        this._start = '';
        this._end = '';
        this.relations = [];
    }
    /**
     * Add a first or second relationship to node.
     * @param {Relationship} rel
     */
    addRelationship (rel) {
        const [rel1, rel2] = this.relations;
        if (rel2 && rel2.id === rel.id) {
            this.relations[1] = rel;
            return;
        }
        if (rel1 && rel1.id === rel.id) {
            this.relations[0] = rel;
            return;
        }
        if (!rel1) {
            this.relations[0] = rel;
            // The first relationship setst he start/end.
            [this._start, this._end] = [rel.source, rel.target].sort();
            return;
        }
        if (!rel2) {
            this.relations[1] = rel;
            return;
        }
        throw new Error('Link already has two relationships.');
    }
    /**
     * Remove relationship from link.
     * @param {String} id
     */
    removeRelationship (id) {
        const [rel1, rel2] = this.relations;
        if (rel2 && rel2.id === id) {
            this.relations.splice(1, 1);
            return;
        }
        if (rel1 && rel1.id === id) {
            this.relations.splice(0, 1);
        }
    }
    /**
     * Have all the relations been remove from this link
     * @returns {Boolean}
     */
    get isLinkEmpty () {
        return this.relations.length === 0;
    }
    /**
     * Link id to know which matching relationships can be joined here.
     * See Relationship.mapLinkId
     */
    get linkId () {
        return [this._start, this._end].sort().join('-');
    }
    /**
     * Is a relationship part of this link.
     * @param {String} uuid
     * @returns {Boolean}
     */
    isRelationshipIncluded (uuid) {
        const [rel1, rel2] = this.relations;
        return (rel1 && rel1.uuid === uuid) || (rel2 && rel2.uuid === uuid);
    }
    /**
     * The link line is drawn in SVG.
     * @returns {SVGLineElement}
     */
    get element () {
        if (!this._element) {
            this._element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        }
        return this._element;
    }
    /**
     * Relationship to the end of line node.
     * @returns {Relationship|undefined}
     */
    _getToEndRel () {
        return this.relations.find((el) => {
            return el.target === this._end;
        });
    }
    /**
     * Relationship to the start of line node.
     * @returns {Relationship|undefined}
     */
    _getToStartRel () {
        return this.relations.find((el) => {
            return el.target === this._start;
        });
    }
    /**
     * Link description towards the end of the line.
     * @returns {String}
     */
    get toEndDesc () {
        const rel = this._getToEndRel();
        return rel ? rel.type : '';
    }
    /**
     * Link description towards the start of the line.
     * @returns {String}
     */
    get toStartDesc () {
        const rel = this._getToStartRel();
        return rel ? rel.type : '';
    }
    /**
     * HTML content for the label.
     * @returns {String}
     */
    _getLabelContent () {
        let html = '';
        const toEndDesc = this.toEndDesc;
        const toStartDesc = this.toStartDesc;
        if (toEndDesc === toStartDesc) {
            html = `<div>${toEndDesc}<span class="direction">&leftrightarrow;</span></div>`;
        } else {
            if (toEndDesc !== '') {
                html = `<div>${toEndDesc}<span class="direction">&leftarrow;</span></div>`;
            }
            if (toStartDesc !== '') {
                html = `${html}<div>${toStartDesc}<span class="direction">&rightarrow;</span></div>`;
            }
        }
        return html;
    }
    /**
     * Update label text
     * When relationships are edited after it's in the map.
     */
    updateLabelText () {
        if (!this._labelElement) {
            return;
        }
        this.labelElement.innerHTML = this._getLabelContent();
        this._updateLabelPosition();
    }
    /**
     * Label is an HTML element on top of the SVG.
     * @returns {HTMLElement}
     */
    get labelElement () {
        if (!this._labelElement) {
            this._labelElement = document.createElement('div');
            this._labelElement.classList.add('link-label');
            this._labelElement.innerHTML = this._getLabelContent();
        }
        return this._labelElement;
    }
    /**
     * @returns {String} Starting character uuid.
     */
    get start () {
        return this._start;
    }
    /**
     * @returns {String} End character uuid.
     */
    get end () {
        return this._end;
    }
    /**
     * Start of line.
     * @returns {Number[]}
     */
    get startCoords () {
        return [
            Number(this._element.getAttribute('x1')),
            Number(this._element.getAttribute('y1'))
        ];
    }
    /**
     * Set coordinates for start of line.
     * @param {Number} x
     * @param {Number} y
     */
    set startCoords ([x, y]) {
        this._element.setAttribute('x1', x);
        this._element.setAttribute('y1', y);
        this._updateLabelPosition();
    }
    /**
     * End of line.
     * @returns {Number[]}
     */
    get endCoords () {
        return [
            Number(this._element.getAttribute('x2')),
            Number(this._element.getAttribute('y2'))
        ];
    }
    /**
     * Set coordinates for end of line.
     * @param {Number} x
     * @param {Number} y
     */
    set endCoords ([[x1, y1], [x3, y3]]) {
        // set to center...
        const x = x1 + ((x3 - x1) / 2);
        const y = y1 + ((y3 - y1) / 2);
        this._element.setAttribute('x2', x);
        this._element.setAttribute('y2', y);
        this._updateLabelPosition();
    }
    /**
     * Get coordinates of the center of the line's bounding box.
     * @returns {Number[]}
     */
    _getLineCenter () {
        const [x1, y1] = this.startCoords;
        const [x2, y2] = this.endCoords;

        const lineWidth = (x2 > x1 ? (x2 - x1) : (x1 - x2));
        const lineHeight = (y2 > y1 ? (y2 - y1) : (y1 - y2));

        const x = x2 > x1
            ? (x1 + (lineWidth / 2))
            : (x2 + (lineWidth / 2));
        const y = y2 > y1
            ? (y1 + (lineHeight / 2))
            : (y2 + (lineHeight / 2));

        return [
            x,
            y
        ];
    }
    /**
     * Angle of line.
     * 0 - 180 is top arc from left.
     * 0 - -180 is bottom arc from left.
     * Same values needed for CSS rotate.
     * @returns {Number}
     */
    _getLineAngle () {
        const [x1, y1] = this.startCoords;
        const [x2, y2] = this.endCoords;
        const dY = y1 - y2;
        const dX = x1 - x2;
        return (Math.atan2(dY, dX) / Math.PI * 180.0);
    }
    /**
     * Rotate arrows to point right way.
     * since they start pointing opposite directions
     * we can use the same rotate value.
     */
    _updateArrows () {
        const angle = this._getLineAngle();
        const arrows = this.labelElement.querySelectorAll('.direction');
        arrows.forEach((arrow) => {
            arrow.style.transform = `rotate(${angle}deg)`;
        });
    }
    /**
     * Update position of the label and its arrows
     */
    _updateLabelPosition () {
        const element = this.labelElement;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const [cx, cy] = this._getLineCenter();
        const x = cx - (width / 2);
        const y = cy - (height / 2);

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.bottom = 'auto';
        element.style.right = 'auto';
        this._updateArrows();
    }
    /**
     * Remove elements from page.
     */
    removeLink () {
        this.element.parentNode.removeChild(this.element);
        this.labelElement.parentNode.removeChild(this.labelElement);
    }
}
