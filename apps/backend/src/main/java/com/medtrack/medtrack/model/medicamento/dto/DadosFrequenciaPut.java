package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.FrequenciaUsoTipo;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record DadosFrequenciaPut(

        FrequenciaUsoTipo frequenciaUsoTipo,

        List<LocalTime> horariosEspecificos,

        @Positive
        Integer intervaloHoras,

        LocalTime primeiroHorario,

        @FutureOrPresent
        LocalDate dataInicio,

        @Future
        LocalDate dataTermino
) {
}
