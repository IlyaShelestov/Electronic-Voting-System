const {
    isValidName,
    isValidSurname,
    isValidIIN,
    isValidText,
    isValidEmail,
    isValidDate,
    isValidPhoneNumber,
    isStrongPassword
  } = require("../../src/utils/dataValidation.js"); 

  
  describe("Data Validation Tests", () => {
    describe("isValidName", () => {
      it("should return true for valid names", () => {
        expect(isValidName("Алексей")).toBe(true);
        expect(isValidName("Касым-Жомарт")).toBe(true);
      });
  
      it("should return false for invalid names", () => {
        expect(isValidName("A")).toBe(false); // слишком короткое
        expect(isValidName("АлексейАлексейАлексей")).toBe(false); // слишком длинное
        expect(isValidName("алексей")).toBe(false); // не с заглавной буквы
        expect(isValidName("Алексей-")).toBe(false); // некорректный формат
      });
    });
  
    describe("isValidIIN", () => {
      it("should return true for valid IIN", () => {
        expect(isValidIIN("123456789012")).toBe(true);
      });
  
      it("should return false for invalid IIN", () => {
        expect(isValidIIN("12345678901")).toBe(false);
        expect(isValidIIN("1234567890123")).toBe(false);
        expect(isValidIIN("12345678901a")).toBe(false);
      });
    });
  
    describe("isValidText", () => {
      it("should return true for valid text", () => {
        expect(isValidText("Hello, world!")).toBe(true);
        expect(isValidText("Привет, мир!")).toBe(true);
      });
  
      it("should return false for invalid text", () => {
        expect(isValidText("")).toBe(false);
        expect(isValidText("a".repeat(256))).toBe(false);
        expect(isValidText("Hello@world")).toBe(false);
      });
    });
  
    describe("isValidEmail", () => {
      it("should return true for valid email", () => {
        expect(isValidEmail("test@example.com")).toBe(true);
      });
  
      it("should return false for invalid email", () => {
        expect(isValidEmail("test@.com")).toBe(false);
        expect(isValidEmail("test.com")).toBe(false);
      });
    });
  
    describe("isValidDate", () => {
      it("should return true for valid date", () => {
        expect(isValidDate("2023-10-10")).toBe(true);
      });
  
      it("should return false for invalid date", () => {
        expect(isValidDate("10-10-2023")).toBe(false);
        expect(isValidDate("2023/10/10")).toBe(false);
        expect(isValidDate("not a date")).toBe(false);
      });
    });
  
    describe("isValidPhoneNumber", () => {
      it("should return true for valid phone number", () => {
        expect(isValidPhoneNumber("87001234567")).toBe(true);
      });
  
      it("should return false for invalid phone number", () => {
        expect(isValidPhoneNumber("7001234567")).toBe(false);
        expect(isValidPhoneNumber("+7700123456a")).toBe(false);
      });
    });

    describe("isStrongPassword", () => {
      it("should return true for strong password", () => {
        expect(isStrongPassword("StrongP@ssw0rd")).toBe(true);
      });
  
      it("should return false for weak password", () => {
        expect(isStrongPassword("weakpass")).toBe(false);
        expect(isStrongPassword("12345678")).toBe(false);
        expect(isStrongPassword("password")).toBe(false);
        expect(isStrongPassword("1")).toBe(false);
        expect(isStrongPassword("!@@2a2d")).toBe(false);
      });
    });
  }
);