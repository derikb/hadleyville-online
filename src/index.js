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

if (document.body.id === 'page-settings') {
    setupPage();
}
