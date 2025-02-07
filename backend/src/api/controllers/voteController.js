const Vote = require("../../models/Vote");
const { generateOneTimeToken } = require("../../utils/voteToken");

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const { id } = req.user;
    const token = await generateOneTimeToken();
    const vote = await Vote.cast({
      electionId,
      candidateId,
      token,
      userId: id,
    });
    res.status(200).json(vote);
  } catch (err) {
    res.status(500).json({ message: "Error casting vote" });
  }
};

exports.checkVoted = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { id } = req.user;
    const voted = await Vote.checkVoted({ electionId, userId: id });
    res.status(200).json(voted);
  } catch (err) {
    res.status(500).json({ message: "Error checking vote" });
  }
};
