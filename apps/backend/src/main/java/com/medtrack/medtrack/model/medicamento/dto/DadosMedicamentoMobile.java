package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.Medicamento;

public record DadosMedicamentoMobile(
        Long id,
        String nome,
        String compostoAtivo,
        String dosagem,
        String imagemUrl,
        FrequenciaUsoMobile frequenciaUso
) {
    public DadosMedicamentoMobile(Medicamento medicamento) {
        this(
                medicamento.getId(),
                medicamento.getNome(),
                medicamento.getPrincipioAtivo(),
                medicamento.getDosagem(),
                medicamento.getImagemUrl(),
                new FrequenciaUsoMobile(medicamento.getFrequenciaUso())
        );
    }
}
