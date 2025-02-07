require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { verifyToken } = require("./api/middlewares/authMiddleware");
const authRoutes = require("./api/routes/authRoutes");
const electionsRoutes = require("./api/routes/electionsRoutes");
const candidatesRoutes = require("./api/routes/candidatesRoutes");
const voteRoutes = require("./api/routes/voteRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "eVote.kz API Running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/elections", verifyToken, electionsRoutes);
app.use("/api/candidates", verifyToken, candidatesRoutes);
app.use("/api/vote", verifyToken, voteRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
