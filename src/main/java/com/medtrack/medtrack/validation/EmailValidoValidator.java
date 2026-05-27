package com.medtrack.medtrack.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailValidoValidator implements ConstraintValidator<EmailValido, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return false;
        }
        return ValidationUtils.EMAIL_PATTERN.matcher(trimmed).matches();
    }
}
