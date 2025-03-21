const User = require("../../models/User");
const bcrypt = require("bcrypt");
const {
  isValidName,
  isValidIIN,
  isValidText,
  isValidEmail,
  isValidDate,
  isValidPhoneNumber,
} = require("../../utils/dataValidation");

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
      city_id,
      phone_number,
      email,
      password,
      role,
    } = req.body;

    // Проверка на заполненность всех обязательных полей
    if (
      !iin ||
      !first_name ||
      !last_name ||
      !date_of_birth ||
      !city_id ||
      !phone_number ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Валидация
    if (!isValidIIN(iin)) {
      return res.status(400).json({ message: "Invalid IIN format" });
    }
    if (!isValidName(first_name)) {
      return res.status(400).json({ message: "Invalid first name format" });
    }
    if (!isValidName(last_name)) {
      return res.status(400).json({ message: "Invalid last name format" });
    }
    if (patronymic && !isValidName(patronymic)) {
      return res.status(400).json({ message: "Invalid patronymic format" });
    }
    if (!isValidDate(date_of_birth)) {
      return res
        .status(400)
        .json({ message: "Invalid date format (YYYY-MM-DD expected)" });
    }
    // if (!isValidText(city)) {
    //   return res.status(400).json({ message: "Invalid city format" });
    // }
    if (!isValidPhoneNumber(phone_number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      iin,
      first_name,
      last_name,
      patronymic,
      date_of_birth,
      city_id,
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
    const lastId = await User.getLastId();

    if (lastId < id) {
      return res.status(404).json({ message: "User not found" });
    }
    const response = await User.delete(id);
    if (response === undefined) {
      return res.status(410).json({ message: "User already deleted" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    foundByIIn = await User.findByIIN(data.iin);
    foundByPhoneNumber = await User.findByPhoneNumber(data.phone_number);
    foundByEmail = await User.findByEmail(data.email);
    if (foundByIIn && foundByIIn.user_id != id) {
      return res.status(409).json({ message: "IIN already exists" });
    }
    if (foundByPhoneNumber && foundByPhoneNumber.user_id != id) {
      return res.status(409).json({ message: "Phone number already exists" });
    }
    if (foundByEmail && foundByEmail.user_id != id) {
      return res.status(409).json({ message: "Email already exists" });
    }
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
