package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.Estoque;

public record DadosEstoqueGet(
        Long id,
        Integer quantidadeAtual,
        Integer quantidadeMinima,
        boolean estoqueBaixo
) {
    public DadosEstoqueGet(Estoque estoque) {
        this(
                estoque.getId(),
                estoque.getQuantidadeAtual(),
                estoque.getQuantidadeMinima(),
                estoque.isBaixo()
        );
    }
}