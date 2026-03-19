import type { EntityFormData } from "../types/entity";

/**
 * Validation utilities for entity forms
 */
export const validateEntityForm = (
  formData: EntityFormData,
): { isValid: boolean; errors?: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (formData.name.length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  if (!formData.description || formData.description.trim().length === 0) {
    // Description is optional, so we won't add an error here
  } else if (formData.description.length > 500) {
    errors.description = "Description must be less than 500 characters";
  }

  if (!formData.status) {
    errors.status = "Status is required";
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, ...(isValid ? {} : { errors }) };
};

/**
 * Sanitizes form data before submission
 */
export const sanitizeEntityData = (
  formData: EntityFormData,
): EntityFormData => {
  return {
    name: formData.name.trim(),
    description: formData.description ? formData.description.trim() : "",
    status: formData.status,
  };
};
