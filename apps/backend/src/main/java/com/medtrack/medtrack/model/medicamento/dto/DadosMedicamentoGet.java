package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.Medicamento;

    public record DadosMedicamentoGet (

            Long id,
            String nome,
            String principioAtivo,
            String dosagem,
            String observacoes,
            String imagemUrl,
            DadosEstoqueGet estoque,
            DadosFrequenciaUsoGet frequenciaUso

    ) {
        public DadosMedicamentoGet(Medicamento medicamento) {
            this(
                    medicamento.getId(),
                    medicamento.getNome(),
                    medicamento.getPrincipioAtivo(),
                    medicamento.getDosagem(),
                    medicamento.getObservacoes(),
                    medicamento.getImagemUrl(),
                    medicamento.getEstoque() != null ? new DadosEstoqueGet(medicamento.getEstoque()) : null,
                    medicamento.getFrequenciaUso() != null ? new DadosFrequenciaUsoGet(medicamento.getFrequenciaUso()) : null
            );
        }
    }


