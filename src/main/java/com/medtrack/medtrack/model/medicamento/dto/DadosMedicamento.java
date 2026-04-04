package com.medtrack.medtrack.model.medicamento.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record DadosMedicamento(

        @NotBlank
        String nome,

        @NotBlank
        String principioAtivo,

        String dosagem,

        String observacoes,

        @NotNull
        Long usuarioId,

        Long dependenteId,

        @NotNull
        @Valid
        DadosFrequenciaUso frequenciaUso,

        @Valid
        DadosEstoque estoque

) {

}
