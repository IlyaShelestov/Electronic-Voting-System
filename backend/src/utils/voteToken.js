const crypto = require("crypto");

const SECRET_KEY = process.env.VOTE_SECRET_KEY;

async function generateOneTimeToken() {
  const nonce = crypto.randomBytes(16).toString("hex");
  const token = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(nonce)
    .digest("hex");
  return `${token}.${nonce}`;
}

async function verifyOneTimeToken(receivedToken) {
  const parts = receivedToken.split(".");
  if (parts.length !== 2) return false;

  const [tokenPart, nonce] = parts;
  const expectedToken = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(nonce)
    .digest("hex");

  if (expectedToken.length !== tokenPart.length) {
    console.log("Invalid Token!");
    return false;
  }

  const valid = crypto.timingSafeEqual(
    Buffer.from(expectedToken, "hex"),
    Buffer.from(tokenPart, "hex")
  );

  if (!valid) {
    console.log("Invalid Token!");
    return false;
  }

  return true;
}

module.exports = {
  generateOneTimeToken,
  verifyOneTimeToken,
};
