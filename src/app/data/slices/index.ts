import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHttpClient } from "@pokedex/utils";

const client = getHttpClient("https://pokeapi.co/api/v2");

interface FetchPokemonPayload {
  offset: number;
  limit: number;
}

export const fetchPokemon = createAsyncThunk(
  "pokemon/fetch",
  async (payload: FetchPokemonPayload, { rejectWithValue }) => {
    try {
      const { offset, limit } = payload;
      const response = await client.get(
        `/pokemon?offset=${offset}&limit=${limit}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPokemonById = createAsyncThunk(
  "pokemon/fetch",
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const response = await client.get(`/pokemon/${payload.name}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  data: {
    results: [],
    count: 0,
    next: null,
    previous: null,
  },
  loading: true,
  error: null,
};

const initialStateForSpecificPokemon = {
  data: {},
  loading: true,
  error: null,
};

export const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload as unknown as any;
        state.error = null;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as unknown as any;
      });
  },
});

export const selectedPokemonSlice = createSlice({
  name: "selectedPokemon",
  initialState: initialStateForSpecificPokemon,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPokemonById.fulfilled, (state, action) => {
        state.loading = false;
        const {
          abilities,
          sprites,
          stats,
          types,
          base_experience,
          ...response
        } = action.payload as unknown as any;

        state.data = {
          ...response,
          baseExperience: base_experience,
          avatarImage: sprites?.front_default ?? "",
          coverImage: sprites?.other?.home?.front_default ?? "",
          abilities: abilities?.map((a: any) => ({
            name: a.ability.name,
            url: a.ability.url,
          })),
          stats: stats?.map((st: any) => {
            return {
              baseState: st.base_stat,
              effort: st.effort,
              name: st.stat.name,
              url: st.stat.url,
            };
          }),
          types: types?.map((t: any) => ({
            name: t.type.name,
            url: t.type.url,
          })),
        };
        state.error = null;
      })
      .addCase(fetchPokemonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as unknown as any;
      });
  },
});
