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

    @Column(name = "comprovante_imagem_url")
    private String comprovanteImagemUrl;

    public Confirmacao(DadosConfirmacao dados, Usuario usuario, Medicamento medicamento) {
        this(dados, usuario, medicamento, null);
    }

    public Confirmacao(DadosConfirmacao dados, Usuario usuario, Medicamento medicamento, String comprovanteImagemUrl) {
        this.usuario = usuario;
        this.medicamento = medicamento;
        this.horario = dados.horario();
        this.data = dados.data();
        this.foiTomado = dados.foiTomado();;
        this.observacao = dados.observacao();
        this.comprovanteImagemUrl = comprovanteImagemUrl;

    }
}
