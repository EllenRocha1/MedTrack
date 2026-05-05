package com.medtrack.medtrack.model.confirmacao.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record DadosConfirmacao(

        @NotNull
        Long usuarioId,

        @NotNull
        Long medicamentoId,

        @NotNull
        LocalTime horario,

        @NotNull
        LocalDate data,

        @NotNull
        boolean foiTomado,
        String observacao
) {
}
