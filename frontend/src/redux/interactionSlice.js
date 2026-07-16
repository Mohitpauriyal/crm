import { createSlice } from "@reduxjs/toolkit";

const interactionSlice = createSlice({
  name: "interaction",

  initialState: {
    interactions: [],
  },

  reducers: {
    addInteraction: (state, action) => {
      state.interactions.push(action.payload);
    },

    setInteractions: (state, action) => {
      state.interactions = action.payload;
    },
  },
});

export const { addInteraction, setInteractions } =
  interactionSlice.actions;

export default interactionSlice.reducer;