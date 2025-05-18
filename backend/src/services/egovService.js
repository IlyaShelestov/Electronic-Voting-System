const axios = require("axios");
const base = process.env.EGOV_SERVICE_URL;

async function getAllCitizens() {
  const data = await axios.get(`${base}/api/citizens`);
  return data.data;
}

async function getCitizenByIIN(iin) {
  const data = await axios.get(`${base}/api/citizens/${iin}`);
  return data.data;
}

module.exports = { getAllCitizens, getCitizenByIIN };
