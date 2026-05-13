package com.medtrack.medtrack.model.dependente;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.medtrack.medtrack.model.dependente.dto.DadosDependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependentePut;
import com.medtrack.medtrack.model.usuario.Usuario;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Dependentes")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Dependente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String telefone;

    @ManyToOne
    @JoinColumn(name = "administrador_id", nullable = false)
    @JsonBackReference
    private Usuario administrador;

    private String nomeUsuario;

    private String senhaHashed;



    public Dependente(@Valid DadosDependente dados, Usuario administrador) {
        this.nome = dados.nome();
        this.email = dados.email();
        this.telefone = dados.telefone();
        this.administrador = administrador;
        this.nomeUsuario = dados.nomeUsuario();
        this.senhaHashed = dados.senha();
    }

    public void atualizarInformacoes(DadosDependentePut dados) {
        if(dados.nome() != null) {
            nome = dados.nome();
        }

        if(dados.email() != null) {
            email = dados.email();
        }

        if(dados.telefone() != null) {
            telefone = dados.telefone();
        }

        if(dados.nomeUsuario() != null){
            nomeUsuario = dados.nomeUsuario();
        }
        if(dados.senhaHashed() != null){
            senhaHashed = dados.senhaHashed();
        }
    }
}
