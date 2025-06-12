import { z } from "zod";

import { UserRoleEnum } from "@/models/UserRole";

import { getPasswordStrength, validateIIN } from "./validationHelpers";

// Helper function for patronymic validation
const patronymicValidation = z
  .string()
  .optional()
  .nullable()
  .refine(
    (value) => {
      if (!value || value.length === 0) return true; // Allow empty patronymic

      if (value.length < 2) return false;
      if (value.length > 20) return false;
      if (!/^[А-ЯЁA-Z][а-яёa-z]+$/.test(value)) return false;
      return true;
    },
    {
      message: "validation.patronymicInvalid",
    }
  );

// Helper function for IIN validation with checksum
const iinValidation = z
  .string()
  .regex(/^[0-9]{12}$/, "validation.iinFormat")
  .refine((value) => validateIIN(value), {
    message: "validation.iinChecksum",
  });

// Helper function for age validation
const dateOfBirthValidation = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "validation.dateFormat")
  .refine(
    (value) => {
      const birthDate = new Date(value);
      return birthDate <= new Date();
    },
    {
      message: "validation.dateInFuture",
    }
  )
  .refine(
    (value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;
      return actualAge >= 18;
    },
    {
      message: "validation.ageMinimum",
    }
  );

// Validation schema for login form
export const loginSchema = z.object({
  iin: iinValidation,
  password: z
    .string()
    .min(1, "validation.passwordRequired")
    .max(255, "validation.passwordTooLong"),
});

// Validation schema for registration form
export const registerSchema = z.object({
  iin: iinValidation,
  first_name: z
    .string()
    .min(2, "validation.firstNameMinLength")
    .max(20, "validation.firstNameMaxLength")
    .regex(
      /^[А-ЯЁA-Z][а-яёa-z]+(-[А-ЯЁA-Z][а-яёa-z]+)?$/,
      "validation.firstNameFormat"
    ),
  last_name: z
    .string()
    .min(2, "validation.lastNameMinLength")
    .max(20, "validation.lastNameMaxLength")
    .regex(/^[А-ЯЁA-Z][а-яёa-z]+$/, "validation.lastNameFormat"),
  patronymic: patronymicValidation,
  date_of_birth: dateOfBirthValidation,
  city_id: z
    .number()
    .positive("validation.cityRequired")
    .int("validation.cityInvalid"),
  phone_number: z.string().regex(/^(\+7|8)\d{10}$/, "validation.phoneFormat"),
  email: z
    .string()
    .email("validation.emailInvalid")
    .max(255, "validation.emailTooLong"),
  password: z
    .string()
    .min(9, "validation.passwordMinLength")
    .regex(/[A-Za-z]/, "validation.passwordMustContainLetter")
    .regex(/\d/, "validation.passwordMustContainNumber")
    .regex(/[@$!%*?&]/, "validation.passwordMustContainSpecial")
    .refine(
      (password) => {
        const strength = getPasswordStrength(password);
        return strength.strength !== "weak";
      },
      {
        message: "validation.passwordTooWeak",
      }
    ),
  role: z.enum([UserRoleEnum.USER], {
    errorMap: () => ({ message: "validation.roleInvalid" }),
  }),
});

// Validation schema for profile field changes
export const fieldChangeSchema = z.object({
  field_name: z
    .enum([
      "phone_number",
      "email",
      "city_id",
      "first_name",
      "last_name",
      "patronymic",
    ])
    .refine((val) => val !== undefined, "validation.fieldNameRequired"),
  new_value: z.string().min(1, "validation.newValueRequired").trim(),
});

// Dynamic validation for individual field changes
export const getFieldValidationSchema = (fieldName: string) => {
  switch (fieldName) {
    case "first_name":
      return z
        .string()
        .min(2, "validation.firstNameMinLength")
        .max(20, "validation.firstNameMaxLength")
        .regex(
          /^[А-ЯЁA-Z][а-яёa-z]+(-[А-ЯЁA-Z][а-яёa-z]+)?$/,
          "validation.firstNameFormat"
        );
    case "last_name":
      return z
        .string()
        .min(2, "validation.lastNameMinLength")
        .max(20, "validation.lastNameMaxLength")
        .regex(/^[А-ЯЁA-Z][а-яёa-z]+$/, "validation.lastNameFormat");
    case "patronymic":
      return patronymicValidation;
    case "email":
      return z
        .string()
        .email("validation.emailInvalid")
        .max(255, "validation.emailTooLong");
    case "phone_number":
      return z.string().regex(/^(\+7|8)\d{10}$/, "validation.phoneFormat");
    case "city_id":
      return z
        .number()
        .positive("validation.cityRequired")
        .int("validation.cityInvalid");
    default:
      return z.string().min(1, "validation.valueRequired");
  }
};

// Validation schema for user update (admin functionality)
export const userUpdateSchema = z.object({
  iin: iinValidation,
  first_name: z
    .string()
    .min(2, "validation.firstNameMinLength")
    .max(20, "validation.firstNameMaxLength")
    .regex(
      /^[А-ЯЁA-Z][а-яёa-z]+(-[А-ЯЁA-Z][а-яёa-z]+)?$/,
      "validation.firstNameFormat"
    ),
  last_name: z
    .string()
    .min(2, "validation.lastNameMinLength")
    .max(20, "validation.lastNameMaxLength")
    .regex(/^[А-ЯЁA-Z][а-яёa-z]+$/, "validation.lastNameFormat"),
  patronymic: patronymicValidation,
  date_of_birth: dateOfBirthValidation,
  city_id: z
    .number()
    .positive("validation.cityRequired")
    .int("validation.cityInvalid"),
  phone_number: z.string().regex(/^(\+7|8)\d{10}$/, "validation.phoneFormat"),
  email: z
    .string()
    .email("validation.emailInvalid")
    .max(255, "validation.emailTooLong"),
  role: z.enum(["user", "admin", "manager", "candidate"], {
    errorMap: () => ({ message: "validation.roleInvalid" }),
  }),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("validation.emailInvalid")
    .max(255, "validation.emailTooLong"),
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, "validation.otpIncomplete")
      .regex(/^\d+$/, "validation.otpDigitsOnly"),
    password: z
      .string()
      .min(9, "validation.passwordMinLength")
      .regex(/[A-Za-z]/, "validation.passwordMustContainLetter")
      .regex(/\d/, "validation.passwordMustContainNumber")
      .regex(/[@$!%*?&]/, "validation.passwordMustContainSpecial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type FieldChangeFormData = z.infer<typeof fieldChangeSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
