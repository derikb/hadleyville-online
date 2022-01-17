import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notes-reducer.js';
import npcsReducer from './npcs-reducer.js';
import townReducer from './town-reducer.js';
import relationshipReducer from './relationship-reducer.js';
import relMapReducer from './relmap-reducer.js';
import { save, load } from 'redux-localstorage-simple';

const store = configureStore({
    reducer: {
        notes: notesReducer,
        npcs: npcsReducer,
        town: townReducer,
        relationships: relationshipReducer,
        relmap: relMapReducer
    },
    preloadedState: load(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(save())
});

export default store;
