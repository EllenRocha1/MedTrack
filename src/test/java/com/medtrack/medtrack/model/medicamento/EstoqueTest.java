package com.medtrack.medtrack.model.medicamento;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EstoqueTest {

    @Test
    void deveDecrementarQuantidadeAtualQuandoMaiorQueZero() {
        Estoque estoque = new Estoque(2, 1, new Medicamento());

        estoque.decrementar();

        assertEquals(1, estoque.getQuantidadeAtual());
    }

    @Test
    void naoDeveDecrementarAbaixoDeZero() {
        Estoque estoque = new Estoque(0, 1, new Medicamento());

        estoque.decrementar();

        assertEquals(0, estoque.getQuantidadeAtual());
    }

    @Test
    void deveIdentificarEstoqueBaixo() {
        assertTrue(new Estoque(4, 5, new Medicamento()).isBaixo());
        assertFalse(new Estoque(6, 5, new Medicamento()).isBaixo());
        assertFalse(new Estoque(6, null, new Medicamento()).isBaixo());
    }
}
