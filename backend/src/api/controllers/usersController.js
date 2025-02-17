const User = require("../../models/User");

exports.getProfileInfo = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findbyId(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error getting profile info" });
  }
};

// Complete Later
exports.requestChange = async (res, req) => {
  res.status(200).json({ message: "Request change" });
};
