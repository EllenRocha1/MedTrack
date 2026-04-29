package com.medtrack.medtrack.model.usuario.dto;

import java.util.List;

public record DadosDashboardPessoal(
    long medicamentosAtivos,
    long reposicoesUrgentes,
    long proximasDoses,
    List<DadosMedicamentoGet> listaMedicamentosHoje
) {
}