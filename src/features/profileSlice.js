import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    nama: "",
    image: "",
  },
  reducers: {
    setProfile: (state, action) => {
      state.nama = action.payload.nama;
      state.image = action.payload.image;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
