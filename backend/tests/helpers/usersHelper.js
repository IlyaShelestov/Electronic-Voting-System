const User = require("../../src/models/User");
const Candidate = require("../../src/models/Candidate");
const bcrypt = require("bcrypt");

const generalData = {
  first_name: "TestName",
  last_name: "TestSurname",
  patronymic: "TestPatronymic",
  date_of_birth: "2021-01-01",
  city_id: 1,
  password: "!W152Sdsbx",
};

const randomizeNumber = (length) => {
  return Math.floor(Math.random() * 10 ** length);
};

const randomizeEmail = () => {
  return `test${randomizeNumber(5)}@test.com`;
};

const createUserData = (role, overrides = {}) => {
  return {
    iin: `${randomizeNumber(12)}`,
    phone_number: `${randomizeNumber(10)}`,
    email: randomizeEmail(),
    role,
    ...generalData,
    ...overrides,
  };
};

const createUser = async (role, overrides = {}) => {
  try {
    const data = createUserData(role, overrides);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password_hash: hashedPassword });
    return user;
  } catch (error) {
    console.error(`Error creating ${role}:`, error);
    throw error;
  }
};

const createAdmin = async (overrides = {}) => {
  return createUser("admin", overrides);
};

const createManager = async (overrides = {}) => {
  return createUser("manager", overrides);
};

const createStandardUser = async (overrides = {}) => {
  return createUser("user", overrides);
};

const createCandidate = async (overrides = {}) => {
  try {
    const user = await createStandardUser();
    const newCandidate = {
      user_id: user.user_id,
      bio: "TestBio",
      party: "TestParty",
      ...overrides,
    };
    const candidate = await Candidate.create(newCandidate);
    return candidate;
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};

module.exports = {
  createAdmin,
  createManager,
  createStandardUser,
  createCandidate,
};
