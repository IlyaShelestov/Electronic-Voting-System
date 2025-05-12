const validator = require("validator");

const isValidName = (name, min = 2, max = 20) => {
  return (
    typeof name === "string" &&
    name.length >= min &&
    name.length <= max &&
    /^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/.test(name) // Разрешены только русские буквы, первая буква заглавная, двойные имена (Касым-Жомарт)
  );
};

const isValidSurname = (name, min = 2, max = 20) => {
  return (
    typeof name === "string" &&
    name.length >= min &&
    name.length <= max &&
    /^[А-ЯЁ][а-яё]+$/.test(name) // Разрешены только русские буквы, первая буква заглавная
  );
};

const isValidIIN = (iin) => {
  return typeof iin === "string" && /^[0-9]{12}$/.test(iin); // Разрешены только цифры, длина должна быть равна 12 символам
};

const isValidText = (text, min = 1, max = 255) => {
  return (
    typeof text === "string" &&
    text.length >= min &&
    text.length <= max &&
    /^[a-zA-Zа-яёА-ЯЁ0-9\s.,!?()-]+$/.test(text) // Разрешены буквы на кириллице и латинице, также пробел и специальные символы .,!?()-
  );
};

const isValidEmail = (email) => {
  return typeof email === "string" && validator.isEmail(email);
};

const isValidDate = (date) => {
  return (
    typeof date === "string" &&
    validator.isDate(date, { format: "YYYY-MM-DD", strictMode: true })
  );
};

const isValidPhoneNumber = (phone) => {
  return (
    typeof phone === "string" &&
    validator.isMobilePhone(phone, "kk-KZ") &&
    (phone.startsWith("+7") || phone.startsWith("8")) // Проверка начинается ли номер с +7 или 
  );
};

const isStrongPassword = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 9 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
};

module.exports = {
  isValidName,
  isValidSurname,
  isValidIIN,
  isValidText,
  isValidEmail,
  isValidDate,
  isValidPhoneNumber,
  isStrongPassword
};
