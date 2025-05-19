const axios = require("axios");
const base = process.env.OTP_SERVICE_URL;

async function verifyOtp(email, otp) {
  try {
    await axios.post(`${base}/api/otp/verify`, { email, otp });
    return { status: true, message: "OTP verified successfully" };
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || "OTP service error";
      if (status === 400 || status === 404) {
        return { status: false, message };
      }
      const e = new Error(message);
      e.status = status;
      throw e;
    }
    const e = new Error("Cannot reach OTP service");
    e.status = 502;
    throw e;
  }
}

async function sendOtp(email) {
  try {
    const response = await axios.post(`${base}/api/otp/send`, { email });
    return response.data;
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || "OTP service error";
      const e = new Error(message);
      e.status = status;
      throw e;
    }
    const e = new Error("Cannot reach OTP service");
    e.status = 502;
    throw e;
  }
}

module.exports = { verifyOtp, sendOtp };
