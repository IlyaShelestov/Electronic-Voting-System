const jwt = require("jsonwebtoken");

const getRegionAndCity = (req) => {
  const token = req.cookies.token;
  if (!token) {
    throw new Error("Unauthorized");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { region, city } = decoded;
  return { region, city };
};

module.exports = {
  getRegionAndCity,
};
