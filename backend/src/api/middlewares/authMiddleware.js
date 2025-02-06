const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

exports.isAnalyst = (req, res, next) => {
  if (req.user.role !== "analyst") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

exports.preventLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.status(403).json({ message: "Already logged in" });
    } catch (err) {
      next();
    }
  } else {
    next();
  }
};
