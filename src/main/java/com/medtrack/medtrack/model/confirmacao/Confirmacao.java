package com.medtrack.medtrack.model.confirmacao;

import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Confirmacao")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString
public class Confirmacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;

    private LocalTime horario;
    private LocalDate data;
    private boolean foiTomado;
    private String observacao;

    public Confirmacao(DadosConfirmacao dados, Usuario usuario, Medicamento medicamento) {
        this.usuario = usuario;
        this.medicamento = medicamento;
        horario = dados.horario();
        data = dados.data();
        foiTomado = dados.foiTomado();;
        observacao = dados.observacao();

    }
}
