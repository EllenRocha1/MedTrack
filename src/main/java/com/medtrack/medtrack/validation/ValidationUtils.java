package com.medtrack.medtrack.validation;

import java.util.regex.Pattern;

public final class ValidationUtils {

    public static final String EMAIL_REGEX = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    public static final String TELEFONE_REGEX = "^(?:(?:\\+?55\\s?)?(?:\\(?\\d{2}\\)?\\s?)?(?:9\\d{3}[-\\s]?\\d{4}|\\d{4}[-\\s]?\\d{4})|(?:\\+?[1-9]\\d{0,2}\\s?)?(?:\\(?\\d{1,4}\\)?\\s?)?(?:\\d{4,5}[-\\s]?\\d{4}))$";

    public static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX, Pattern.CASE_INSENSITIVE);
    public static final Pattern TELEFONE_PATTERN = Pattern.compile(TELEFONE_REGEX);

    private ValidationUtils() {
    }

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    public static String normalizeTelefone(String telefone) {
        if (telefone == null) {
            return null;
        }
        String normalized = telefone.trim().replaceAll("[^\\d+]+", "");
        return normalized.isEmpty() ? null : normalized;
    }

    public static String trimIfPresent(String value) {
        return value == null ? null : value.trim();
    }
}
