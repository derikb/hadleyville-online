/**
 * Links between Characters on the relaionship map.
 * It has two elements (one is SVG), so it can't be a web component, at least the SVG can't.
 * @todo make the label a component?
 * @prop {Relationship} rel
 */
export default class NPCLink {
    constructor ({
        rel = null
    }) {
        this.rel = rel;
    }
    /**
     * The link line is drawn in SVG.
     * @returns {SVGLineElement}
     */
    get element () {
        if (!this._element) {
            this._element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            this._element.setAttribute('marker-end', 'url(#arrow)');
            // @todo maybe each link needs its own marker so marker.refX can be set relative to line length.
        }
        return this._element;
    }
    /**
     * Label is an HTML element on top of the SVG.
     * @returns {HTMLElement}
     */
    get labelElement () {
        if (!this._labelElement) {
            this._labelElement = document.createElement('div');
            this._labelElement.classList.add('link-label');
            this._labelElement.innerHTML = this.rel.type;
            this._labelElement.style.position = 'absolute';
            this._labelElement.style.zIndex = 50;
        }
        return this._labelElement;
    }
    /**
     * @returns {String} Source npc uuid.
     */
    get source () {
        return this.rel.source;
    }
    /**
     * @returns {String} Target npc uuid.
     */
    get target () {
        return this.rel.target;
    }
    /**
     * Start of line.
     * @returns {Number[]}
     */
    get sourceCoords () {
        return [
            Number(this._element.getAttribute('x1')),
            Number(this._element.getAttribute('y1'))
        ];
    }
    /**
     * Set coordinates for source of line.
     * @param {Number} x
     * @param {Number} y
     */
    set sourceCoords ([x, y]) {
        this._element.setAttribute('x1', x);
        this._element.setAttribute('y1', y);
        this.updateLabel();
    }
    /**
     * End of line.
     * @returns {Number[]}
     */
    get targetCoords () {
        return [
            Number(this._element.getAttribute('x2')),
            Number(this._element.getAttribute('y2'))
        ];
    }
    /**
     * Set coordinates for target of line.
     * @param {Number} x
     * @param {Number} y
     */
    // set targetCoords ([x, y]) {
    //     this._element.setAttribute('x2', x);
    //     this._element.setAttribute('y2', y);
    //     this.updateLabel();
    // }
    set targetCoords ([[x1, y1], [x3, y3]]) {
        // set to center...
        const x = x1 + ((x3 - x1) / 2);
        const y = y1 + ((y3 - y1) / 2);
        this._element.setAttribute('x2', x);
        this._element.setAttribute('y2', y);
        this.updateLabel();
    }
    /**
     * Get coordinates of the center of the line's bounding box.
     * @returns {Number[]}
     */
    getLineCenter () {
        const [x1, y1] = this.sourceCoords;
        const [x2, y2] = this.targetCoords;

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
     * Update position of the label.
     */
    updateLabel () {
        const element = this.labelElement;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const [cx, cy] = this.getLineCenter();
        const x = cx - (width / 2);
        const y = cy - (height / 2);

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.bottom = 'auto';
        element.style.right = 'auto';
    }
}
