import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    nama: "",
    gambar: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.nama = action.payload.nama;
      state.gambar = action.payload.gambar;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
