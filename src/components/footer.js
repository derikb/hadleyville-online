const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/style.css">
<style>
    :host {
        grid-area: footer;
        padding: 1rem;
        border-top: 1px solid var(--primary);
        background-color: var(--surface2);
        font-size: 1.1rem;
    }
    p {
        margin: 0;
    }
</style>
<p>Written in Mar-Apr 2021 by Derik A. Badman <a href="https://derikbadman.com">https://derikbadman.com</a> Game info and updates at <a href="https://madinkbeard.itch.io/hadleyville">https://madinkbeard.itch.io/hadleyville</a></p>
`;

class Footer extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setAttribute('role', 'footer');
    }

    connectedCallback () {
    }

    disconnectedCallback () {

    }
};

window.customElements.define('had-footer', Footer);

export default Footer;
