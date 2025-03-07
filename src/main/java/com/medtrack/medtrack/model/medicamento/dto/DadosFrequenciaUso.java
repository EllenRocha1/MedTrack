package com.medtrack.medtrack.model.medicamento.dto;

import com.medtrack.medtrack.model.medicamento.FrequenciaUsoTipo;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record DadosFrequenciaUso(
        Long id,

        @NotNull
        FrequenciaUsoTipo frequenciaUsoTipo,

        @NotEmpty
        List<String> diasSemana,

        List<LocalTime> horariosEspecificos,

        Integer intervaloHoras,

        LocalTime primeiroHorario,

        @FutureOrPresent
        LocalDate dataInicio,

        @Future
        LocalDate dataTermino
) {
}

