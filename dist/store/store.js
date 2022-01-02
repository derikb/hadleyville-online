
import { configureStore } from '../../node_modules/@reduxjs/toolkit/dist/index.js';
import notesReducer from './notes-reducer.js';
import npcsReducer from './npcs-reducer.js';
import townReducer from './town-reducer.js';
import { save, load } from "../../node_modules/redux-localstorage-simple/dist/index.js";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    npcs: npcsReducer,
    town: townReducer
  },
  preloadedState: load(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(save())
});


export default store;
