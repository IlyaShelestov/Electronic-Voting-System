const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

exports.register = async (req, res) => {
  try {
    const {
      iin,
      name,
      surname,
      patronymic,
      nationality,
      birth_date,
      region,
      city,
      address,
      sex,
      email,
      phone,
      password,
      role,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.createUser(
      iin,
      name,
      surname,
      patronymic,
      nationality,
      birth_date,
      region,
      city,
      address,
      sex,
      email,
      phone,
      hashedPassword,
      role
    );

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { iin, password } = req.body;
    const user = await User.findByIIN(iin);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};
