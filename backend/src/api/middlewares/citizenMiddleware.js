const { getCitizenByIIN } = require("../../services/egovService");

async function checkCitizenCorrect(req, res, next) {
  const { iin, email, phone_number } = req.body;
  try {
    const citizen = await getCitizenByIIN(iin);
    if (!citizen || !citizen.citizen_id) {
      return res
        .status(400)
        .json({ message: "Citizen not found in eGov system" });
    }
    if (citizen.email !== email || citizen.phone_number !== phone_number) {
      return res.status(400).json({
        message: "Citizen has different email/phone attached to his IIN",
      });
    }
    next();
  } catch (err) {
    console.error("eGov lookup failed:" + err);
    return res.status(502).json({ message: "Unable to verify eGov citizen" });
  }
}

module.exports = checkCitizenCorrect;
