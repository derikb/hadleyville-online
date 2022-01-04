
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

import { setupPage } from './services/importExportService.js';

if (document.body.id === 'page-settings') {
    setupPage();
}
