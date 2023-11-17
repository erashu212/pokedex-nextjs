import { configureStore } from "@reduxjs/toolkit";
import { pokemonSlice, selectedPokemonSlice } from "./slices";

export const store = configureStore({
    reducer: {
      [pokemonSlice.name]: pokemonSlice.reducer,
      [selectedPokemonSlice.name]: selectedPokemonSlice.reducer,
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;