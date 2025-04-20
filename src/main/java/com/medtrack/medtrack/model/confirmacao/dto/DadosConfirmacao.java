package com.medtrack.medtrack.model.confirmacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record DadosConfirmacao(

        @NotNull
        Long usuarioId,

        @NotNull
        Long medicamentoId,

        @NotBlank
        LocalTime horario,

        @NotBlank
        LocalDate data,

        @NotBlank
        boolean foiTomado,
        String observacao
) {
}
