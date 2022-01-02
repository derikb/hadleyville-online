

import Header from '../modules/header.js';
import Footer from '../modules/footer.js';
import TableDrawer from '../modules/tabledrawer.js';
import RTableDisplay from '../modules/rtabledisplay.js';
import TownDisplay from '../modules/towndisplay.js';
import NotesList from '../modules/noteslist.js';
import NoteDisplay from '../modules/notedisplay.js';
import DiceRoller from '../modules/diceroller.js';
import NPCsList from '../modules/npcslist.js';
import NPCDisplay from '../modules/npcdisplay.js';

import { setupPage } from '../services/importExportService.js';

if (document.body.id === 'page-settings') {

    setupPage();

}
