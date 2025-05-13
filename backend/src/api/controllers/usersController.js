const User = require("../../models/User");
const ProfileChangeRequest = require("../../models/ProfileChangeRequest");
const {
  isValidPhoneNumber,
  isValidEmail,
  isValidName,
  isValidSurname,
} = require("../../utils/dataValidation");

exports.getProfileInfo = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error getting profile info" });
  }
};

exports.requestChange = async (req, res) => {
  try {
    const { userId } = req.user;
    const { field_name, new_value } = req.body;

    if (!field_name || !new_value) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId); // Нужно убедиться, что данные, которые хочет изменить пользователь уникальные
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (field_name === "email" && !isValidEmail(new_value)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (field_name === "phone_number" && !isValidPhoneNumber(new_value)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (field_name === "first_name" && !isValidName(new_value)) {
      return res.status(400).json({ message: "Invalid first name format" });
    }

    if (field_name === "last_name" && !isValidSurname(new_value)) {
      return res.status(400).json({ message: "Invalid last name format" });
    }

    if (field_name === "patronymic" && !isValidSurname(new_value)) {
      return res.status(400).json({ message: "Invalid patronymic format" });
    }

    if (!(field_name in user)) {
      return res.status(400).json({ message: "Invalid field name" });
    }

    const allowedFields = [
      "phone_number",
      "email",
      "city_id",
      "first_name",
      "last_name",
      "patronymic",
    ];
    if (!allowedFields.includes(field_name)) {
      return res.status(403).json({ message: "This field cannot be changed" });
    }

    const oldValue = user[field_name];

    if (oldValue == new_value) {
      return res
        .status(400)
        .json({ message: "New value is the same as current value" });
    }

    const request = await ProfileChangeRequest.create({
      user_id: userId,
      field_name,
      old_value: oldValue,
      new_value,
    });

    res.status(201).json({
      message: "Change request submitted successfully",
      request,
    });
  } catch (err) {
    console.error("Error creating change request:", err);
    res.status(500).json({ message: "Error submitting change request" });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const { userId } = req.user;
    const requests = await ProfileChangeRequest.getByUserId(userId);
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error getting change requests" });
  }
};
