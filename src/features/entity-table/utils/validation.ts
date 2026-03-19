import type { EntityFormValues, FormErrors } from "../types/entity";
import { entityFormSchema } from "../types/entity";

/**
 * Validation utilities for entity forms using Zod
 */
export const validateEntityForm = (
  formData: EntityFormValues,
): { isValid: boolean; errors?: FormErrors } => {
  const result = entityFormSchema.safeParse(formData);

  if (!result.success) {
    const errors: Partial<FormErrors> = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof EntityFormValues;
      errors[field] = err.message;
    });
    return { isValid: false, errors: errors as FormErrors };
  }

  return { isValid: true };
};

/**
 * Sanitizes form data before submission
 */
export const sanitizeEntityData = (
  formData: EntityFormValues,
): EntityFormValues => {
  return {
    id: formData.id,
    name: formData.name.trim(),
    date: formData.date,
    value: Number(formData.value),
  };
};

/**
 * Validates form data using Zod and returns typed errors
 */
export const getFormErrors = (formData: EntityFormValues): FormErrors => {
  const result = entityFormSchema.safeParse(formData);

  if (!result.success) {
    const errors: Partial<FormErrors> = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof EntityFormValues;
      errors[field] = err.message;
    });
    return errors as FormErrors;
  }

  return {
    id: undefined,
    name: undefined,
    date: undefined,
    value: undefined,
  };
};
