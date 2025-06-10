import { z } from "zod";

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
      if (!/^[А-ЯЁ][а-яё]+$/.test(value)) return false;
      return true;
    },
    {
      message:
        "Patronymic must be at least 2 characters, not exceed 20 characters, and be in Cyrillic starting with capital letter",
    }
  );

// Helper function for IIN validation with checksum
const iinValidation = z
  .string()
  .regex(/^[0-9]{12}$/, "IIN must be exactly 12 digits")
  .refine((value) => validateIIN(value), {
    message: "Invalid IIN: checksum verification failed",
  });

// Helper function for age validation
const dateOfBirthValidation = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine(
    (value) => {
      const birthDate = new Date(value);
      return birthDate <= new Date();
    },
    {
      message: "Date of birth cannot be in the future",
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
      message: "You must be at least 18 years old",
    }
  );

// Validation schema for login form
export const loginSchema = z.object({
  iin: iinValidation,
  password: z
    .string()
    .min(1, "Password is required")
    .max(255, "Password is too long"),
});

// Validation schema for registration form
export const registerSchema = z.object({
  iin: iinValidation,
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name must not exceed 20 characters")
    .regex(
      /^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/,
      "First name must be in Cyrillic, start with capital letter, and may contain hyphen for compound names"
    ),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name must not exceed 20 characters")
    .regex(
      /^[А-ЯЁ][а-яё]+$/,
      "Last name must be in Cyrillic and start with capital letter"
    ),
  patronymic: patronymicValidation,
  date_of_birth: dateOfBirthValidation,
  city_id: z
    .number()
    .positive("Please select a valid city")
    .int("City ID must be a valid number"),
  phone_number: z
    .string()
    .regex(
      /^(\+7|8)\d{10}$/,
      "Phone number must start with +7 or 8 and contain 11 digits total"
    ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters"),
  password: z
    .string()
    .min(9, "Password must be at least 9 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    )
    .refine(
      (password) => {
        const strength = getPasswordStrength(password);
        return strength.strength !== "weak";
      },
      {
        message: "Password is too weak. Please use a stronger password.",
      }
    ),
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
    .refine((val) => val !== undefined, "Field name is required"),
  new_value: z.string().min(1, "New value cannot be empty").trim(),
});

// Dynamic validation for individual field changes
export const getFieldValidationSchema = (fieldName: string) => {
  switch (fieldName) {
    case "first_name":
      return z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(20, "First name must not exceed 20 characters")
        .regex(
          /^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/,
          "First name must be in Cyrillic, start with capital letter, and may contain hyphen for compound names"
        );
    case "last_name":
      return z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(20, "Last name must not exceed 20 characters")
        .regex(
          /^[А-ЯЁ][а-яё]+$/,
          "Last name must be in Cyrillic and start with capital letter"
        );
    case "patronymic":
      return patronymicValidation;
    case "email":
      return z
        .string()
        .email("Please enter a valid email address")
        .max(255, "Email must not exceed 255 characters");
    case "phone_number":
      return z
        .string()
        .regex(
          /^(\+7|8)\d{10}$/,
          "Phone number must start with +7 or 8 and contain 11 digits total"
        );
    case "city_id":
      return z
        .number()
        .positive("Please select a valid city")
        .int("City ID must be a valid number");
    default:
      return z.string().min(1, "Value is required");
  }
};

// Validation schema for user update (admin functionality)
export const userUpdateSchema = z.object({
  iin: iinValidation,
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name must not exceed 20 characters")
    .regex(
      /^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?$/,
      "First name must be in Cyrillic, start with capital letter, and may contain hyphen for compound names"
    ),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name must not exceed 20 characters")
    .regex(
      /^[А-ЯЁ][а-яё]+$/,
      "Last name must be in Cyrillic and start with capital letter"
    ),
  patronymic: patronymicValidation,
  date_of_birth: dateOfBirthValidation,
  city_id: z
    .number()
    .positive("Please select a valid city")
    .int("City ID must be a valid number"),
  phone_number: z
    .string()
    .regex(
      /^(\+7|8)\d{10}$/,
      "Phone number must start with +7 or 8 and contain 11 digits total"
    ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters"),
  role: z.enum(["user", "admin", "manager", "candidate"], {
    errorMap: () => ({ message: "Invalid role selected" }),
  }),
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type FieldChangeFormData = z.infer<typeof fieldChangeSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
