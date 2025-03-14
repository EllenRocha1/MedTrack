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
        this.frequenciaUsoTipo = dados.frequenciaUsoTipo();
        this.horariosEspecificos = dados.horariosEspecificos();
        this.intervaloHoras = dados.intervaloHoras();
        this.primeiroHorario = dados.primeiroHorario();
        this.dataInicio = dados.dataInicio();
        this.dataTermino = dados.dataTermino();
    }

}
