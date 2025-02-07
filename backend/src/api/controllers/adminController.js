const User = require("../../models/User");
const bcrypt = require("bcrypt");

exports.getAll = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error getting users" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      iin,
      first_name,
      last_name,
      patronymic,
      date_of_birth,
      region,
      city,
      phone_number,
      email,
      password,
      role,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      iin,
      first_name,
      last_name,
      patronymic,
      date_of_birth,
      region,
      city,
      phone_number,
      email,
      password_hash: hashedPassword,
      role,
    };

    const newUser = await User.create(data);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await User.delete(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const response = await User.update(id, data);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Complete Later
exports.approveRequest = async (req, res) => {
  res.status(200).json({ message: "Request Approved" });
};

// Complete Later
exports.rejectRequest = async (req, res) => {
  res.status(200).json({ message: "Request Rejected" });
};
