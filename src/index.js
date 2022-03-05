/* eslint-disable no-unused-vars */
import Header from './components/header.js';
import Footer from './components/footer.js';
import TableDrawer from './components/tabledrawer.js';
import RTableDisplay from './components/rtabledisplay.js';
import TownDisplay from './components/towndisplay.js';
import FactionsList from './components/FactionsList.js';
import FactionDisplay from './components/FactionDisplay.js';
import NotesList from './components/noteslist.js';
import NoteDisplay from './components/notedisplay.js';
import NoteLinkDisplay from './components/noteLinkDisplay.js';
import DiceRoller from './components/diceroller.js';
import NPCsList from './components/npcslist.js';
import NPCDisplay from './components/npcdisplay.js';
import NoteList from './components/NoteList.js';
import NoteListItem from './components/NoteListItem.js';
import PCDisplay from './components/pcdisplay.js';
import PCSelector from './components/pcSelector.js';
import RelationshipDisplay from './components/RelationshipDisplay.js';
import RelationMap from './components/relationMap.js';
import CharacterNode from './components/CharacterNode.js';
import NPCNode from './components/NPCNode.js';
import PCNode from './components/PCNode.js';
import CharacterLink from './components/CharacterLink.js';
import SimpleList from './components/SimpleList.js';

import { setupPage } from './services/importExportService.js';
import { Route, Router } from './services/router.js';
import characterPage from './pages/character.js';

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
    }),
    new Route({
        path: '/character.html',
        fetch: true,
        loadCallback: () => {
            characterPage.loadCallback();
        },
        unloadCallback: () => {
            characterPage.unloadCallback();
        }
    })
];

const router = new Router({
    targetSelector: '#pageContent',
    routes
});
router.start();
