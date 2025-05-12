const User = require("../../models/User");
const ProfileChangeRequest = require("../../models/ProfileChangeRequest");
const bcrypt = require("bcrypt");
const {
  isValidName,
  isValidIIN,
  isValidText,
  isValidEmail,
  isValidDate,
  isValidPhoneNumber,
  isStrongPassword
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
    //   return res.status(400).json({ message: "Invalid city format" }); TODO!: check if city_id is valid
    // }
    if (!isValidPhoneNumber(phone_number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
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

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ProfileChangeRequest.getAll();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error getting change requests" });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ProfileChangeRequest.getById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: "Error getting change request" });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ProfileChangeRequest.getById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    const updateData = {};
    updateData[request.field_name] = request.new_value;

    await User.update(request.user_id, updateData);

    const updatedRequest = await ProfileChangeRequest.updateStatus(
      id,
      "approved"
    );

    res.status(200).json({
      message: "Request approved successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ message: "Error approving request" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ProfileChangeRequest.getById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    const updatedRequest = await ProfileChangeRequest.updateStatus(
      id,
      "rejected"
    );

    res.status(200).json({
      message: "Request rejected successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ message: "Error rejecting request" });
  }
};
