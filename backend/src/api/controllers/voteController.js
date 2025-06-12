const Vote = require("../../models/Vote");
const Candidate = require("../../models/Candidate");
const User = require("../../models/User");
const { generateOneTimeToken } = require("../../utils/voteToken");
const { verifyOtp } = require("../../services/otpService");

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId, otp } = req.body;
    const { userId, region, city } = req.user;

    const candidate = await Candidate.getById(candidateId);
    if (candidate.user_id === userId) {
      return res.status(409).json({ message: "User cannot vote for himself" });
    }

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

    const user = await User.findById(userId);
    const email = user.email;

    if (process.env.NODE_ENV !== "test") {
      if (!otp) {
        return res.status(400).json({ message: "OTP is required" });
      }
      const otpValid = await verifyOtp(email, otp);
      if (otpValid.status == false) {
        return res.status(400).json({ message: otpValid.message });
      }
    }

    const token = await generateOneTimeToken();
    const vote = await Vote.cast({
      electionId,
      candidateId,
      token,
      userId: userId,
    });
    res.status(201).json({ token: vote.token });
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

exports.checkVoteLocation = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { region, city } = req.user;
    const canVote = await Vote.checkCanVoteLocation({
      electionId,
      userRegion: region,
      userCity: city,
    });
    res.status(200).json(canVote);
  } catch (err) {
    res.status(500).json({ message: "Error checking vote location" });
  }
};

exports.checkVoteToken = async (req, res) => {
  try {
    const { token } = req.body;
    const vote = await Vote.checkVoteToken(token);
    if (!vote) {
      return res.status(404).json({ message: "Token not found" });
    }
    res.status(200).json(vote);
  } catch (err) {
    res.status(500).json({ message: "Error checking vote token" });
  }
};
