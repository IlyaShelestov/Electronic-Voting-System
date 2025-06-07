import { IVote } from '@/models/IVote';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoteState {
  votedElections: IVote[];
}

const initialState: VoteState = {
  votedElections: [],
};

const voteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {
    setVoted(state, action: PayloadAction<IVote>) {
      state.votedElections.push(action.payload);
    },
    resetVotes(state) {
      state.votedElections = [];
    },
  },
});

export const { setVoted, resetVotes } = voteSlice.actions;
export default voteSlice.reducer;
