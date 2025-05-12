const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const City = require("../../models/City");
const {
  isValidName,
  isValidIIN,
  isValidText,
  isValidEmail,
  isValidDate,
  isValidPhoneNumber,
  isStrongPassword
} = require("../../utils/dataValidation");

exports.register = async (req, res) => {
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
    } = req.body;

    // Проверка обязательных полей
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

    // Валидация данных
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
    if (!isValidDate(date_of_birth)) { // !TODO: Age should be 18+
      return res
        .status(400)
        .json({ message: "Invalid date format (YYYY-MM-DD expected)" });
    }
    // if (!isValidText(city)) {
    //   return res.status(400).json({ message: "Invalid city format" }); !TODO: check if city_id is valid
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
        .json({ message: "Password must be at least 9 characters long and contain at least one letter, one number, and one special character" });
    }

    // Проверка на существующего пользователя
    const existingUser = await User.findByIIN(iin);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this IIN already exists" });
    }

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
      role: "user",
    };

    const newUser = await User.create(data);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { iin, password } = req.body;
    const user = await User.findByIIN(iin);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const region_id = City.getById(user.city_id).region_id;
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
        city: user.city_id,
        region: region_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // только по HTTPS в проде
      sameSite: "Strict", // защита от CSRF
    });
    res.status(200).json({ message: "Logged in" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out" });
  }
};
