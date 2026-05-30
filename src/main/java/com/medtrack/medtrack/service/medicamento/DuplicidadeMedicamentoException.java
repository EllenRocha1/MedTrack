package com.medtrack.medtrack.service.medicamento;

import com.medtrack.medtrack.model.medicamento.dto.DadosDuplicidadeMedicamento;
import lombok.Getter;

@Getter
public class DuplicidadeMedicamentoException extends RuntimeException {

    private final DadosDuplicidadeMedicamento dadosDuplicidade;

    public DuplicidadeMedicamentoException(DadosDuplicidadeMedicamento dadosDuplicidade) {
        super(dadosDuplicidade.mensagem());
        this.dadosDuplicidade = dadosDuplicidade;
    }

}
