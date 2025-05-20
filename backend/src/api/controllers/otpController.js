const { sendOtp } = require("../../services/otpService");
const { isValidEmail } = require("../../utils/dataValidation");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const data = await sendOtp(email);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error sending OTP:", err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};
