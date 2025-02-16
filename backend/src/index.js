require("./config/environment");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const {
  verifyToken,
  isAdmin,
  isManager,
} = require("./api/middlewares/authMiddleware");
const authRoutes = require("./api/routes/authRoutes");
const electionsRoutes = require("./api/routes/electionsRoutes");
const candidatesRoutes = require("./api/routes/candidatesRoutes");
const voteRoutes = require("./api/routes/voteRoutes");
const usersRoutes = require("./api/routes/usersRoutes");
const eventsRoutes = require("./api/routes/eventsRoutes");
const managerRoutes = require("./api/routes/ManagerRoutes");
const adminRoutes = require("./api/routes/adminRoutes");

const app = express();

app.use(cors());

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
        }
    },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' }, 
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xFrameOptions: { action: 'deny' },
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: false },
    permittedCrossDomainPolicies: { policy: 'none' },
    hidePoweredBy: true,
}));

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
app.use("/api/users", verifyToken, usersRoutes);
app.use("/api/events", verifyToken, eventsRoutes);
app.use("/api/manager", verifyToken, isManager, managerRoutes);
app.use("/api/admin", verifyToken, isAdmin, adminRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
