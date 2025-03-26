package com.medtrack.medtrack.model.medicamento;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.model.usuario.Usuario;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import java.beans.PropertyDescriptor;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "Medicamentos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString

public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nome;
    private String principioAtivo;
    private String dosagem;
    private String observacoes = null;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonBackReference
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "dependente_id")
    @JsonBackReference
    private Dependente dependente;

    @OneToOne (cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "frequencia_uso_id")
    @MapsId
    @NotNull
    @Valid FrequenciaUso frequenciaUso;


    public Medicamento(@Valid DadosMedicamento dadosMedicamento, Usuario usuario) {
        nome = dadosMedicamento.nome();
        principioAtivo = dadosMedicamento.principioAtivo();
        dosagem = dadosMedicamento.dosagem();
        observacoes = dadosMedicamento.observacoes();
        this.usuario = usuario;
        var dadosFrequenciaUso = dadosMedicamento.frequenciaUso();
        this.frequenciaUso = new FrequenciaUso(dadosFrequenciaUso);
    }

    public Medicamento(@Valid DadosMedicamento dadosMedicamento, Dependente dependente) {
        nome = dadosMedicamento.nome();
        principioAtivo = dadosMedicamento.principioAtivo();
        dosagem = dadosMedicamento.dosagem();
        observacoes = dadosMedicamento.observacoes();
        var dadosFrequenciaUso = dadosMedicamento.frequenciaUso();
        this.frequenciaUso = new FrequenciaUso(dadosFrequenciaUso);
        this.dependente = dependente;
    }


    public Medicamento(DadosMedicamento dadosMedicamento, Usuario usuario, Dependente dependente) {
        nome = dadosMedicamento.nome();
        principioAtivo = dadosMedicamento.principioAtivo();
        dosagem = dadosMedicamento.dosagem();
        observacoes = dadosMedicamento.observacoes();
        var dadosFrequenciaUso = dadosMedicamento.frequenciaUso();
        this.frequenciaUso = new FrequenciaUso(dadosFrequenciaUso);
        this.dependente = dependente;
        this.usuario = usuario;
    }

    public Medicamento atualizarInformacoes(DadosMedicamentoPut dadosMedicamentoPut, Medicamento medicamento) {
        BeanUtils.copyProperties(dadosMedicamentoPut, medicamento, getNullPropertyNames(dadosMedicamentoPut));
        return medicamento;
    }

    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper wrappedSource = new BeanWrapperImpl(source);
        return Arrays.stream(wrappedSource.getPropertyDescriptors())
                .map(PropertyDescriptor::getName)
                .filter(name -> wrappedSource.getPropertyValue(name) == null)
                .toArray(String[]::new);
    }

}
