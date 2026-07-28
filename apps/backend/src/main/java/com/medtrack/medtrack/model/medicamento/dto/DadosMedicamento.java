package com.medtrack.medtrack.model.medicamento.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosMedicamento(

        @NotBlank
        String nome,

        @NotBlank
        String principioAtivo,

        String dosagem,

        String observacoes,

        String imagemUrl,

        @NotNull
        Long usuarioId,

        Long dependenteId,

        @NotNull
        @Valid
        DadosFrequenciaUso frequenciaUso,

        @Valid
        DadosEstoque estoque,

        Boolean ignorarDuplicidade

) {

}
