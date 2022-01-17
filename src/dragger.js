/**
 * Class for handling dragging an HTMLElement around the screen.
 * Resize is possible too, but currently commented out/untested.
 *
 * @prop {Number} _startX X coordinate in pixels of drag event when it starts.
 * @prop {Number} _startY Y coordinate in pixels of drag event when it starts.
 * @prop {Number} _startPosX Offset in pixels for the Element when drag starts.
 * @prop {Number} _startPosY Offset in pixels for the Element when drag starts.
 * @prop {Number} _startWidth Starting width of element for resize.
 * @prop {Number} _startHeight Starting height of element for resize.
 * @prop {Boolean} enabled Are dragging events currently enabled.
 * @prop {Function} doDragCallback Bound callback for the drag event.
 * @prop {Function} stopDragCallback Bound callback for the stop drag event.
 * @prop {Function} doResizeCallback Bound callback for the resize event.
 * @prop {Function} stopResizeCallback Bound callback for the stop resize event.
 * @prop {Function} callbackStartDrag Custom callback for when a drag starts. Passed the: dragElement, handleSelector.
 */
export default class Dragger {
    /**
     *
     * @prop {HTMLElement} dragElement Element to drag around.
     * @prop {String} handleSelector Selector for the child element inside dragElement which activates dragging. Don't make this a button.
     * @prop {String} resizeSelector Selector for the child element inside dragElement which activates resizing.
     * @prop {Number} minWidth Minimum width of element.
     * @prop {Number} minHeight Minimum height of element.
     *
     */
    constructor ({
        dragElement = null,
        handleSelector = null,
        resizeSelector = null,
        minWidth = 0,
        minHeight = 0
    }) {
        this.dragElement = dragElement;
        if (!(this.dragElement instanceof HTMLElement)) {
            throw new Error('Dragger.dragElements must be HTMLElement');
        }
        this.handleSelector = handleSelector;
        // this.resizeSelector = resizeSelector;
        this.minWidth = minWidth;
        this.minHeight = minHeight;

        // By binding all these we make sure they can be removed properly.
        this.initDragBound = this.initDrag.bind(this);
        this.doDragCallback = this.doDrag.bind(this);
        this.stopDragCallback = this.stopDrag.bind(this);
        // this.initResizeBound = this.initResize.bind(this);
        // this.doResizeCallback = this.doResize.bind(this);
        // this.stopResizeCallback = this.stopResize.bind(this);

        this._startX = null;
        this._startY = null;
        this._startPosX = null;
        this._startPosY = null;
        this._startWidth = null;
        this._startHeight = null;
        this.enabled = false;
        this.callbackStartDrag = null;
    }
    /**
     * Get the x position of the mouse/touch.
     * @param {Event} ev Drag or touch Event
     * @return {Number}
     */
    getEventX (ev) {
        return (ev.type.toLowerCase().indexOf('touch') === 0) ? ev.touches[0].clientX : ev.clientX;
    }
    /**
     * Get the y position of the mouse/touch.
     * @param {Event} ev Drag or touch Event
     * @return {Number}
     */
    getEventY (ev) {
        return (ev.type.toLowerCase().indexOf('touch') === 0) ? ev.touches[0].clientY : ev.clientY;
    }
    /**
     * Move the box as we drag
     * @param {Event} ev Drag or touch Event
     */
    doDrag (ev) {
        ev.preventDefault();
        // Adjust the node coords based on how much the event moved.
        this.dragElement.coords = [
            this._startPosX + (this.getEventX(ev) - this._startX),
            this._startPosY + (this.getEventY(ev) - this._startY)
        ];
    }
    /**
     * Stop the drag, make sure the box is visible, clean up.
     */
    stopDrag () {
        // make sure it isn't off the map.
        this.dragElement.adjustForParentBounds();

        document.documentElement.removeEventListener('mousemove', this.doDragCallback, false);
        document.documentElement.removeEventListener('touchmove', this.doDragCallback, false);
        document.documentElement.removeEventListener('mouseup', this.stopDragCallback, false);
        document.documentElement.removeEventListener('touchend', this.stopDragCallback, false);
    }
    /**
     * Start a drag action
     * @param {Event} ev Event for mouse down or touchstart
     */
    initDrag (ev) {
        // Stop on center/right clicks.
        if (ev.button > 1) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        this._startX = this.getEventX(ev);
        this._startY = this.getEventY(ev);
        [this._startPosX, this._startPosY] = this.dragElement.coords;
        if (this.callbackStartDrag !== null) {
            this.callbackStartDrag(this.dragElement, this.handleSelector);
        }
        document.documentElement.addEventListener('mousemove', this.doDragCallback, false);
        document.documentElement.addEventListener('touchmove', this.doDragCallback, false);
        document.documentElement.addEventListener('mouseup', this.stopDragCallback, false);
        document.documentElement.addEventListener('touchend', this.stopDragCallback, false);
    }
    /**
     * Remove events stop dragging from working.
     */
    disableDrag () {
        if (!this.enabled) {
            return;
        }
        this.dragElement.removeEventListener('mousedown', this.initDragBound, false);
        this.dragElement.removeEventListener('touchstart', this.initDragBound, false);
        const dragHandle = this.handleSelector === ''
            ? this.dragElement
            : this.dragElement.querySelector(this.handleSelector);
        if (dragHandle !== null) {
            dragHandle.style.cursor = 'auto';
        }
        this.enabled = false;
        // if (!this.resizeSelector) {
        //     return;
        // }
        // const resizeHandle = this.dragElement.querySelector(this.resizeSelector);
        // if (resizeHandle !== null) {
        //     this.dragElement.removeEventListener('mousedown', this.initResizeBound, false);
        //     this.dragElement.removeEventListener('touchstart', this.initResizeBound, false);
        // }
    }
    /**
     * Re-add events starts dragging working again.
     */
    enableDrag () {
        if (this.enabled) {
            return;
        }
        this.dragElement.addEventListener('mousedown', this.initDragBound, false);
        this.dragElement.addEventListener('touchstart', this.initDragBound, false);
        const dragHandle = this.handleSelector === ''
            ? this.dragElement
            : this.dragElement.querySelector(this.handleSelector);
        if (dragHandle !== null) {
            dragHandle.style.cursor = 'move';
        }
        this.enabled = true;
        // if (!this.resizeSelector) {
        //     return;
        // }

        // const resizeHandle = this.dragElement.querySelector(this.resizeSelector);
        // if (resizeHandle === null) {
        //     return;
        // }
        // this.dragElement.addEventListener('mousedown', this.initResizeBound, false);
        // this.dragElement.addEventListener('touchstart', this.initResizeBound, false);
    }
    /**
     * Resize element as we drag.
     * @param {Event} ev Drag or touch event.
     */
    // doResize (ev) {
    //     ev.preventDefault();
    //     let newWidth = (this._startWidth + this.getEventX(ev) - this._startX);
    //     let newHeight = (this._startHeight + this.getEventY(ev) - this._startY);
    //     if (newWidth < this.minWidth) {
    //         newWidth = this.minWidth;
    //     }
    //     if (newHeight < this.minHeight) {
    //         newHeight = this.minHeight;
    //     }
    //     this.dragElement.style.height = `${newHeight}px`;
    //     this.dragElement.style.width = `${newWidth}px`;
    // }
    /**
     * Stop the resize event. Remove resize events.
     */
    // stopResize () {
    //     document.documentElement.removeEventListener('mousemove', this.doResizeCallback, false);
    //     document.documentElement.removeEventListener('touchmove', this.doResizeCallback, false);
    //     document.documentElement.removeEventListener('mouseup', this.stopResizeCallback, false);
    //     document.documentElement.removeEventListener('touchend', this.stopResizeCallback, false);
    // }
    /**
     * Start a drag action
     * @param {Event} ev Event for mouse down or touchstart
     */
    // initResize (ev) {
    //     if (ev.button > 1) {
    //         return;
    //     }
    //     if (!ev.target.closest(this.resizeSelector)) {
    //         return;
    //     }
    //     ev.preventDefault();

    //     // box.style.top = box.offsetTop + 'px';
    //     // box.style.bottom = 'auto';

    //     this._startX = this.getEventX(ev);
    //     this._startY = this.getEventY(ev);

    //     this._startWidth = this.dragElement.offsetWidth;
    //     this._startHeight = this.dragElement.offsetWidth;

    //     document.documentElement.addEventListener('mousemove', this.doResizeCallback, false);
    //     document.documentElement.addEventListener('touchmove', this.doResizeCallback, false);
    //     document.documentElement.addEventListener('mouseup', this.stopResizeCallback, false);
    //     document.documentElement.addEventListener('touchend', this.stopResizeCallback, false);
    // }
};
