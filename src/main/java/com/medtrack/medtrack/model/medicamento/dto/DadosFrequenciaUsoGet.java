package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.FrequenciaUso;
import java.time.LocalTime;
import java.util.List;

public record DadosFrequenciaUsoGet(
        String frequenciaUsoTipo,
        Boolean usoContinuo,
        Integer intervaloHoras,
        List<LocalTime> horariosEspecificos,
        LocalTime primeiroHorario
) {
    public DadosFrequenciaUsoGet(FrequenciaUso f) {
        this(
                f.getFrequenciaUsoTipo() != null ? f.getFrequenciaUsoTipo().name() : null,
                f.isUsoContinuo(),
                f.getIntervaloHoras(),
                f.getHorariosEspecificos(),
                f.getPrimeiroHorario()
        );
    }
}