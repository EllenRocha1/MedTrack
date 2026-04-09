package com.medtrack.medtrack.model.medicamento;

import com.medtrack.medtrack.model.medicamento.dto.DadosFrequenciaUso;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "frequencia_uso")
public class FrequenciaUso {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private FrequenciaUsoTipo frequenciaUsoTipo;

    private boolean usoContinuo;

    @ElementCollection
    private List<LocalTime> horariosEspecificos = null;
    private Integer intervaloHoras = 0;
    private LocalTime primeiroHorario = null;
    private LocalDate dataInicio = null;
    private LocalDate dataTermino = null;

    public FrequenciaUso(@Valid DadosFrequenciaUso dados) {
        frequenciaUsoTipo = dados.frequenciaUsoTipo();
        usoContinuo = dados.usoContinuo();
        horariosEspecificos = dados.horariosEspecificos();
        intervaloHoras = dados.intervaloHoras();
        primeiroHorario = dados.primeiroHorario();
        dataInicio = dados.dataInicio();
        dataTermino = dados.dataTermino();
    }

    public FrequenciaUsoTipo getFrequenciaUsoTipo() { return frequenciaUsoTipo; }
    public boolean isUsoContinuo() { return usoContinuo; }
    public List<LocalTime> getHorariosEspecificos() { return horariosEspecificos; }
    public Integer getIntervaloHoras() { return intervaloHoras; }
    public LocalTime getPrimeiroHorario() { return primeiroHorario; }
    public LocalDate getDataInicio() { return dataInicio; }
    public LocalDate getDataTermino() { return dataTermino; }

}
