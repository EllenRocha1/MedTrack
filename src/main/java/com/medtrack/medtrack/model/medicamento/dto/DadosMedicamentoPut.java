package com.medtrack.medtrack.model.medicamento.dto;

import jakarta.validation.constraints.NotNull;

public record DadosMedicamentoPut(
        @NotNull
        Long usuarioId,

        String nome,

        String principioAtivo,

        String dosagem,

        String observacoes,

        String imagemUrl,

        DadosEstoquePut estoque,

        DadosFrequenciaPut dadosFrequenciaPut
        ) {



}
