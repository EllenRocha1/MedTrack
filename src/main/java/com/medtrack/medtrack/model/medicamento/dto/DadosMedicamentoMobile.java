package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.Medicamento;

public record DadosMedicamentoMobile(
        Long id,
        String nome,
        String compostoAtivo,
        String dosagem,
        FrequenciaUsoMobile frequenciaUso
) {
    public DadosMedicamentoMobile(Medicamento medicamento) {
        this(
                medicamento.getId(),
                medicamento.getNome(),
                medicamento.getPrincipioAtivo(),
                medicamento.getDosagem(),
                new FrequenciaUsoMobile(medicamento.getFrequenciaUso())
        );
    }
}
