package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.FrequenciaUso;
import com.medtrack.medtrack.model.medicamento.FrequenciaUsoTipo;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

public record FrequenciaUsoMobile(
        FrequenciaUsoTipo frequenciaUsoTipo,
        boolean usoContinuo,
        List<String> horariosEspecificos,
        Integer intervaloHoras,
        String primeiroHorario,
        String dataInicio,
        String dataTermino
) {
    public FrequenciaUsoMobile(FrequenciaUso f) {
        this(
                f.getFrequenciaUsoTipo(),
                f.isUsoContinuo(),
                f.getHorariosEspecificos() != null
                        ? f.getHorariosEspecificos().stream()
                          .map(LocalTime::toString)
                          .collect(Collectors.toList())
                        : List.of(),
                f.getIntervaloHoras(),
                f.getPrimeiroHorario() != null ? f.getPrimeiroHorario().toString() : null,
                f.getDataInicio() != null ? f.getDataInicio().toString() : null,
                f.getDataTermino() != null ? f.getDataTermino().toString() : null
        );
    }
}
