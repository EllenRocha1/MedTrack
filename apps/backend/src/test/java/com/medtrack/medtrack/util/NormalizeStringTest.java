package com.medtrack.medtrack.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class NormalizeStringTest {

    @Test
    void deveNormalizarCaixaAcentosEEspacos() {
        assertEquals("paracetamol", NormalizeString.normalize("  Paracetámol  "));
        assertEquals("losartana potassica", NormalizeString.normalize("LOSARTANA   POTÁSSICA"));
    }

    @Test
    void deveRetornarStringVaziaQuandoValorForNulo() {
        assertEquals("", NormalizeString.normalize(null));
    }
}
