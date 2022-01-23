/* eslint-disable no-unused-vars */
import Header from './components/header.js';
import Footer from './components/footer.js';
import TableDrawer from './components/tabledrawer.js';
import RTableDisplay from './components/rtabledisplay.js';
import TownDisplay from './components/towndisplay.js';
import NotesList from './components/noteslist.js';
import NoteDisplay from './components/notedisplay.js';
import DiceRoller from './components/diceroller.js';
import NPCsList from './components/npcslist.js';
import NPCDisplay from './components/npcdisplay.js';
import RelationshipDisplay from './components/relationshipDisplay.js';
import RelationMap from './components/relationMap.js';
import NPCNode from './components/npcNode.js';
import NPCLink from './components/npcLink.js';

import { setupPage } from './services/importExportService.js';
import { Route, Router } from './services/router.js';

// Setup Routes and Router.
const routes = [
    new Route({
        path: '/index.html',
        fetch: true
    }),
    new Route({
        path: '/rules.html',
        fetch: true
    }),
    new Route({
        path: '/intro.html',
        fetch: true
    }),
    new Route({
        path: '/graph.html',
        fetch: true,
        unloadCallback: () => {
            // Reset some changes to the route target
            const parent = document.querySelector('#pageContent');
            parent.style.height = null;
            parent.style.width = null;
            parent.style.overflow = null;
        }
    }),
    new Route({
        path: '/settings.html',
        fetch: true,
        loadCallback: () => {
            setupPage();
        }
    })
];

const router = new Router({
    targetSelector: '#pageContent',
    routes
});
router.start();
