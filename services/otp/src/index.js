require("./config/environment");
const express = require("express");
const morgan = require("morgan");

const otpRoutes = require("./api/routes/otpRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "OTP Email Service is running" });
});

app.use("/api/otp", otpRoutes);

const PORT = process.env.PORT || 7000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
