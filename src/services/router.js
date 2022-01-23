/**
 * @prop {String} path relative path for route
 * @prop {String} [output] Html to insert into route target.
 * @prop {Boolean} fetch If true fetch route data from path.
 * @prop {Function} loadCallback Called after routed output is inserted into page.
 * @prop {Function} unloadCallback Called before routed output is removed from page.
 */
class Route {
    constructor ({
        path = '',
        output = '',
        fetch = false,
        loadCallback = null,
        unloadCallback = null
    }) {
        this.path = path;
        this.output = output;
        this.fetch = fetch;
        this.loadCallback = loadCallback;
        this.unloadCallback = unloadCallback;
        if (!this.path) {
            throw Error('Route path cannot be empty.');
        }
    }
    setup () {
        if (this.loadCallback) {
            this.loadCallback();
        }
    }
    tearDown () {
        if (this.unloadCallback) {
            this.unloadCallback();
        }
    }
}

/**
 * @prop {String} targetSelector Selector for where routes are output.
 * @prop {HTMLElement} target Element where routes are output.
 * @prop {Route[]} routes Routes.
 * @prop {Route|null} currentRoute
 */
class Router {
    constructor ({
        targetSelector = '',
        routes = []
    }) {
        this.targetSelector = targetSelector;
        this.target = document.querySelector(targetSelector);
        if (!this.target) {
            throw new Error('Router target not found.');
        }
        this.routes = [];
        routes.forEach((route) => {
            if (!(route instanceof Route)) {
                return;
            }
            this.routes.push(route);
        });
        this.currentRoute = null;
    }
    /**
     * Get route based on path.
     * @param {String} path
     * @returns {Route|undefined}
     */
    _getRoute (path) {
        return this.routes.find((route) => {
            return route.path === path;
        });
    }

    _getOutputFromHtmlPage (html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        const frag = template.content.cloneNode(true);
        return frag.querySelector(this.targetSelector);
    }
    /**
     * Get route content and insert into target.
     * @param {Route} route
     */
    _loadRouteContent (route) {
        if (route.fetch) {
            fetch(route.path)
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    // Clean up old route.
                    if (this.currentRoute) {
                        this.currentRoute.tearDown();
                    }
                    this.target.innerHTML = '';
                    // Insert new route.
                    const output = this._getOutputFromHtmlPage(text);
                    this.target.append(...Array.from(output.children));
                    this.currentRoute = route;
                    route.setup();
                })
                .catch((err) => {
                    console.log(err);
                });
            return;
        }
        if (this.currentRoute) {
            this.currentRoute.tearDown();
        }
        this.target.innerHTML = '';
        this.target.innerHTML = route.output;
        this.currentRoute = route;
        route.setup();
    }
    /**
     * Add the events to start up the router.
     */
    start () {
        /**
         * Route load triggered by an event called
         * Usually this is a link somewhere in the page.
         * @param {CustomEvent} ev
         */
        document.body.addEventListener('loadRoute', (ev) => {
            try {
                const url = new URL(ev.detail.route);
                const route = this._getRoute(url.pathname);
                if (route) {
                    ev.preventDefault();
                    this._loadRouteContent(route);
                    window.history.pushState(null, document.title, route.path);
                }
            } catch (e) {
                console.log(e.message);
            }
        });
        /**
         * Route load trigged by forward/back nav button in browser.
         * @param {Event} ev
         */
        window.onpopstate = (ev) => {
            const route = this._getRoute(window.location.pathname);
            if (route) {
                this._loadRouteContent(route);
            }
        };

        // Call setup on the page that was loaded without the router.
        this.currentRoute = this._getRoute(window.location.pathname);
        if (this.currentRoute) {
            this.currentRoute.setup();
        }
    }
}

export {
    Route,
    Router
};
