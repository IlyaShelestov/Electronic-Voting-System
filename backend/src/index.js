require("./config/environment");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

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
const managerRoutes = require("./api/routes/managerRoutes");
const adminRoutes = require("./api/routes/adminRoutes");

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Authorization", "RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
  optionsSuccessStatus: 204,
  maxAge: 600, // 10 минут
};
app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xFrameOptions: { action: "deny" },
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: false },
    permittedCrossDomainPolicies: { policy: "none" },
    hidePoweredBy: true,
  })
);

const limiterOptions = {
  windowMs: 15 * 60 * 1000, // Период времени (15 минут)
  max: 100,                 // Максимальное число запросов за период
  standardHeaders: true,    // Стандартные заголовки с информацией о лимите
  legacyHeaders: false,     // Отключение устаревших заголовков
  message: "Превышен лимит запросов, пожалуйста, повторите позже.",
};
app.use("/api", rateLimit(limiterOptions));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
