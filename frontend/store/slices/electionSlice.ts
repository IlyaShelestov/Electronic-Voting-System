import { IElection } from '@/models/IElection';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ElectionState {
  elections: IElection[];
  selectedElection: IElection | null;
}

const initialState: ElectionState = {
  elections: [],
  selectedElection: null,
};

const electionSlice = createSlice({
  name: "election",
  initialState,
  reducers: {
    setElections(state, action: PayloadAction<IElection[]>) {
      state.elections = action.payload;
    },
    selectElection(state, action: PayloadAction<IElection | null>) {
      state.selectedElection = action.payload;
    },
  },
});

export const { setElections, selectElection } = electionSlice.actions;
export default electionSlice.reducer;
