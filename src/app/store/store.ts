
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notes-reducer';
//import npcsReducer from './npcs-reducer';

const store = configureStore({
  reducer: {
    notes: notesReducer,
    //npcs: npcsReducer,
  },
});


export default store;
