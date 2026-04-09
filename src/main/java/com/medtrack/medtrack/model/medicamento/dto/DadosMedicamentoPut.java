package com.medtrack.medtrack.model.medicamento.dto;

import jakarta.validation.constraints.NotNull;
import com.medtrack.medtrack.model.medicamento.dto.DadosEstoquePut;

public record DadosMedicamentoPut(
        @NotNull
        Long usuarioId,

        String nome,

        String principioAtivo,

        String dosagem,

        String observacoes,

        DadosEstoquePut estoque,

        DadosFrequenciaPut dadosFrequenciaPut
        ) {



}
