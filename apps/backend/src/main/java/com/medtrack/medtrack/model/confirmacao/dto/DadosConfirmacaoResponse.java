package com.medtrack.medtrack.model.confirmacao.dto;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;

import java.time.LocalDate;
import java.time.LocalTime;

public record DadosConfirmacaoResponse(
        Long id,
        Long usuarioId,
        Long medicamentoId,
        LocalTime horario,
        LocalDate data,
        boolean foiTomado,
        String observacao,
        String comprovanteImagemUrl
) {
    public DadosConfirmacaoResponse(Confirmacao confirmacao) {
        this(
                confirmacao.getId(),
                confirmacao.getUsuario().getId(),
                confirmacao.getMedicamento().getId(),
                confirmacao.getHorario(),
                confirmacao.getData(),
                confirmacao.isFoiTomado(),
                confirmacao.getObservacao(),
                confirmacao.getComprovanteImagemUrl()
        );
    }
}
