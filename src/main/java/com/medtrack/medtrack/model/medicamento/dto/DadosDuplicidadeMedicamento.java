package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.Medicamento;

public record DadosDuplicidadeMedicamento(
        boolean duplicidade,
        Long medicamentoExistenteId,
        String principioAtivoConflitante,
        String nomeMedicamentoExistente,
        String mensagem
) {
    public DadosDuplicidadeMedicamento(Medicamento medicamento) {
        this(
                true,
                medicamento.getId(),
                medicamento.getPrincipioAtivo(),
                medicamento.getNome(),
                "JÁ existe um medicamento cadastrado com o mesmo principio ativo. " +
                        "Verifique se ha risco de duplicidade antes de continuar."
        );
    }
}
