package com.medtrack.medtrack.model.medicamento.dto;

import jakarta.validation.constraints.PositiveOrZero;

public record DadosEstoque(
    @PositiveOrZero Integer quantidadeAtual,
    @PositiveOrZero Integer quantidadeMinima
) {}