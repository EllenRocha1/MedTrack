package com.medtrack.medtrack.util.exception;

import com.medtrack.medtrack.model.medicamento.dto.DadosDuplicidadeMedicamento;

public class DuplicidadeMedicamentoException extends RuntimeException {

    private final DadosDuplicidadeMedicamento dadosDuplicidade;

    public DuplicidadeMedicamentoException(DadosDuplicidadeMedicamento dadosDuplicidade) {
        super(dadosDuplicidade.mensagem());
        this.dadosDuplicidade = dadosDuplicidade;
    }

    public DadosDuplicidadeMedicamento getDadosDuplicidade() {
        return dadosDuplicidade;
    }
}
