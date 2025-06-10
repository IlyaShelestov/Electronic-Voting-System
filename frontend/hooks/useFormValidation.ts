import { useCallback, useRef, useState } from "react";
import { z } from "zod";

export interface ValidationError {
  field: string;
  message: string;
  severity?: "error" | "warning";
}

export interface UseFormValidationResult<T> {
  errors: ValidationError[];
  validate: (data: T) => boolean;
  validateField: (
    field: keyof T,
    value: any,
    debounce?: boolean
  ) => string | null;
  validateFieldAsync: (field: keyof T, value: any) => Promise<string | null>;
  clearErrors: () => void;
  clearFieldError: (field: keyof T) => void;
  hasErrors: boolean;
  hasWarnings: boolean;
  getFieldError: (field: keyof T) => string | null;
  getFieldSeverity: (field: keyof T) => "error" | "warning" | null;
  isValidating: boolean;
}

export function useFormValidation<T>(
  schema: z.ZodSchema<T>
): UseFormValidationResult<T> {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const debounceTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const validate = useCallback(
    (data: T): boolean => {
      try {
        schema.parse(data);
        setErrors([]);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors: ValidationError[] = error.errors.map(
            (err) => ({
              field: err.path.join("."),
              message: err.message,
            })
          );
          setErrors(validationErrors);
          return false;
        }
        return false;
      }
    },
    [schema]
  );

  const validateField = useCallback(
    (field: keyof T, value: any): string | null => {
      try {
        // Create a partial schema for just this field
        const fieldName = field as string;
        const fieldSchema = (schema as any).shape[field];

        if (fieldSchema) {
          fieldSchema.parse(value);
          // Clear any existing error for this field
          setErrors((prev) =>
            prev.filter((error) => error.field !== fieldName)
          );
          return null;
        }
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const message = error.errors[0]?.message || "Invalid value";
          // Update errors for this specific field
          setErrors((prev) => {
            const filtered = prev.filter(
              (error) => error.field !== (field as string)
            );
            return [...filtered, { field: field as string, message }];
          });
          return message;
        }
        return "Invalid value";
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) =>
      prev.filter((error) => error.field !== (field as string))
    );
  }, []);
  const getFieldError = useCallback(
    (field: keyof T): string | null => {
      const error = errors.find((error) => error.field === (field as string));
      return error ? error.message : null;
    },
    [errors]
  );

  const validateFieldAsync = useCallback(
    async (field: keyof T, value: any): Promise<string | null> => {
      return new Promise((resolve) => {
        const fieldName = field as string;
        // Clear existing timeout for this field
        const existingTimeout = debounceTimeouts.current.get(fieldName);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // Set new timeout for debounced validation
        const timeout = setTimeout(() => {
          try {
            const fieldSchema = (schema as any).shape[field];

            if (fieldSchema) {
              fieldSchema.parse(value);
              // Clear any existing error for this field
              setErrors((prev) =>
                prev.filter((error) => error.field !== fieldName)
              );
              resolve(null);
            } else {
              resolve(null);
            }
          } catch (error: any) {
            const message = error.errors?.[0]?.message || "Invalid value";
            // Update errors for this specific field
            setErrors((prev) => {
              const filtered = prev.filter(
                (error) => error.field !== fieldName
              );
              return [
                ...filtered,
                { field: fieldName, message, severity: "error" },
              ];
            });
            resolve(message);
          }
        }, 300);

        debounceTimeouts.current.set(fieldName, timeout);
      });
    },
    [schema]
  );

  const getFieldSeverity = useCallback(
    (field: keyof T): "error" | "warning" | null => {
      const error = errors.find((error) => error.field === (field as string));
      return error ? error.severity || "error" : null;
    },
    [errors]
  );

  const hasWarnings = errors.some((error) => error.severity === "warning");
  return {
    errors,
    validate,
    validateField,
    validateFieldAsync,
    clearErrors,
    clearFieldError,
    hasErrors: errors.length > 0,
    hasWarnings,
    getFieldError,
    getFieldSeverity,
    isValidating,
  };
}
