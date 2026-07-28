package com.medtrack.medtrack.util;

import java.text.Normalizer;

public final class NormalizeString {

    private NormalizeString() {
    }

    public static String normalize(String value) {
        if (value == null) {
            return "";
        }

        String withoutAccents = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        return withoutAccents
                .trim()
                .replaceAll("\\s+", " ")
                .toLowerCase();
    }
}
