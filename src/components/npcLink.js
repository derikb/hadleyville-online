/**
 * Links between Characters on the relaionship map.
 * This can accomodate 1 or 2 Relationship models.
 * It has two elements (one is SVG), so it can't be a web component, at least the SVG can't.
 * @todo make the label a component?
 * @prop {String} _start uuid for start of line node
 * @prop {String} _end uuid for end of line node
 * @prop {String} _descToEnd Description of relationship from start -> end
 * @prop {String} _descToStart Description of relationship from end -> start
 */
export default class NPCLink {
    constructor () {
        this._start = '';
        this._end = '';
        this._descToEnd = '';
        this._descToStart = '';
    }
    /**
     * Add a first or second relationship to node.
     * @param {Relationship} rel
     */
    addRelationship (rel) {
        if (this._start === '') {
            // no relation yet.
            this._start = rel.source;
            this._end = rel.target;
            this._descToEnd = rel.type;
            return;
        }
        this._descToStart = rel.type;
    }
    /**
     * Link id to know which matching relationships can be joined here.
     * See Relationship.mapLinkId
     */
    get linkId () {
        return [this._start, this._end].sort().join('-');
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

    _getLabelContent () {
        let html = '';
        if (this._descToEnd === this._descToStart) {
            html = `<div>${this._descToEnd}<span class="direction">&leftrightarrow;</span></div>`;
        } else {
            if (this._descToEnd !== '') {
                html = `<div>${this._descToEnd}<span class="direction">&leftarrow;</span></div>`;
            }
            if (this._descToStart !== '') {
                html = `${html}<div>${this._descToStart}<span class="direction">&rightarrow;</span></div>`;
            }
        }
        return html;
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
     * @returns {String} Starting npc uuid.
     */
    get start () {
        return this._start;
    }
    /**
     * @returns {String} End npc uuid.
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
        this._updateLabel();
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
        this._updateLabel();
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
     * Update position of the label.
     */
    _updateLabel () {
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
}
