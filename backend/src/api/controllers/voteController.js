const Vote = require("../../models/Vote");
const { generateOneTimeToken } = require("../../utils/voteToken");

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const { userId } = req.user;

    const hasVoted = await Vote.checkVoted({ electionId, userId: userId });
    if (hasVoted) {
      return res.status(409).json({ message: "User has already voted" });
    }

    const canVoteLocation = await Vote.checkCanVoteLocation({
      electionId,
      userRegion: region,
      userCity: city,
    });
    if (!canVoteLocation) {
      return res
        .status(403)
        .json({ message: "User cannot vote in this election" });
    }

    const token = await generateOneTimeToken();
    const vote = await Vote.cast({
      electionId,
      candidateId,
      token,
      userId: userId,
    });
    res.status(200).json(vote);
  } catch (err) {
    res.status(500).json({ message: "Error casting vote" });
  }
};

exports.checkVoted = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { userId } = req.user;
    const voted = await Vote.checkVoted({ electionId, userId: userId });
    res.status(200).json(voted);
  } catch (err) {
    res.status(500).json({ message: "Error checking vote" });
  }
};
