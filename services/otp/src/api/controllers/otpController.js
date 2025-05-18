const Otp = require("../../models/Otp");
const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "eVote.kz OTP Service",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending OTP to ${email}:`, error);
    throw new Error("Failed to send OTP email");
  }
};

const verifyTime = (createdAt) => {
  const now = Date.now();
  const otpAgeMs = now - createdAt.getTime() + 60 * 60 * 1000;

  const maxOtpAge = parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 5;
  const expiryMs = maxOtpAge * 60 * 1000;

  return otpAgeMs < expiryMs;
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOtp();

  try {
    const existingRecord = await Otp.findByEmail(email);
    if (existingRecord) {
      const createdAt = new Date(existingRecord.created_at);
      if (verifyTime(createdAt)) {
        return res.status(400).json({ message: "OTP already sent" });
      }
    }
    await Otp.create(email, otp);
    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Error sending OTP", error });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const record = await Otp.findByEmail(email);

    if (!record) {
      return res.status(404).json({ message: "No OTP found for this email" });
    }

    const createdAt = new Date(record.created_at);

    if (!verifyTime(createdAt)) {
      await Otp.deleteByEmail(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (record.attempts >= 3) {
      await Otp.deleteByEmail(email);
      return res.status(400).json({ message: "Maximum attempts exceeded" });
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      await Otp.updateAttempts(email, record.attempts);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Otp.deleteByEmail(email);

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP", error });
  }
};
