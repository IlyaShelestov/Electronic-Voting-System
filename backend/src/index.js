require("./config/environment");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

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
const locationsRoutes = require("./api/routes/locationsRoutes");
const otpRoutes = require("./api/routes/otpRoutes");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.BACKEND_URL  || "http://localhost:7000"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: denied access from ${origin}`));
    }
  },  // Разрешённый источник для запросов
  credentials: true, // Разрешает передачу cookie и заголовков авторизации (Authorization) между фронтендом и сервером
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],  // Указывает, какие HTTP-методы разрешены для кросс-доменных запросов 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],    // Разрешённые заголовки, которые клиент может отправлять на сервер.
  exposedHeaders: ["Authorization", "RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],   // Указывает, какие заголовки сервер позволяет клиенту читать в ответе.
  optionsSuccessStatus: 204,  // Указывает HTTP-статус для успешных preflight-запросов (OPTIONS).
  maxAge: 600, // Указывает, сколько секунд браузер может кэшировать preflight-запрос (10 минут)
};
app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Разрешает контент только с текущего домена
        scriptSrc: ["'self'"], // Разрешает выполнение скриптов только с текущего домена
        styleSrc: ["'self'", "'unsafe-inline'"], // Разрешает стили с текущего домена
        imgSrc: ["'self'", "data:"], // Разрешает изображения только с текущего домена и data URL
        connectSrc: ["'self'"], // Разрешает сетевые запросы только к текущему домену
        frameAncestors: ["'none'"], // Запрещает встраивание в iframe (защита от Clickjacking)
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin" }, // Защита от атак межсайтового доступа
    crossOriginResourcePolicy: { policy: "same-origin" }, // Запрещает загрузку ресурсов с других доменов
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Ограничивает передачу реферера на сторонние сайты
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Принудительное использование HTTPS (1 год)
    xFrameOptions: { action: "deny" }, // Запрещает встраивание сайта в iframe
    xContentTypeOptions: true, // Защита от MIME-тип атак
    xDnsPrefetchControl: { allow: false }, // Запрещает предзагрузку DNS-запросов
    permittedCrossDomainPolicies: { policy: "none" }, // Запрещает использование кросс-доменных политик
    hidePoweredBy: true, // Скрывает заголовок X-Powered-By (уменьшает риск атак)
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

if (process.env.NODE_ENV === 'development') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/elections", electionsRoutes);
app.use("/api/candidates", candidatesRoutes);
app.use("/api/vote", verifyToken, voteRoutes);
app.use("/api/users", verifyToken, usersRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/manager", verifyToken, isManager, managerRoutes);
app.use("/api/admin", verifyToken, isAdmin, adminRoutes);
app.use("/api/locations", locationsRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
