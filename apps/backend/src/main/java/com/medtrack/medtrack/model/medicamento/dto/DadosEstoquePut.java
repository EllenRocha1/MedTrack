package com.medtrack.medtrack.model.medicamento.dto;

import jakarta.validation.constraints.PositiveOrZero;

public record DadosEstoquePut(
    @PositiveOrZero
    Integer quantidadeAtual,
    @PositiveOrZero
    Integer quantidadeMinima
) {}