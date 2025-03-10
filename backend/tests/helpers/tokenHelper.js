const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (payload, options = {}) => {
  const defaultOptions = { expiresIn: "1h" };
  return jwt.sign(payload, JWT_SECRET, { ...defaultOptions, ...options });
};

const getAdminToken = (overrides = {}) => {
  const payload = {
    userId: 1,
    role: "admin",
    city: 1,
    region: 1,
    ...overrides,
  };
  return generateToken(payload);
};

const getManagerToken = (overrides = {}) => {
  const payload = {
    userId: 2,
    role: "manager",
    city: 1,
    region: 1,
    ...overrides,
  };
  return generateToken(payload);
};

const getUserToken = (overrides = {}) => {
  const payload = {
    userId: 3,
    role: "user",
    city: 1,
    region: 1,
    ...overrides,
  };
  return generateToken(payload);
};

module.exports = {
  getAdminToken,
  getManagerToken,
  getUserToken,
};
