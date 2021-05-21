
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notes-reducer';
import npcsReducer from './npcs-reducer';
import townReducer from './town-reducer';
import { save, load } from "redux-localstorage-simple";

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
