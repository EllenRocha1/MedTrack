package com.medtrack.medtrack.model.usuario;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private CategoriaUsuario tipoConta;
    private String nome;
    private String email;
    private String senhaHashed;

    private LocalDate dataNascimento;

    private String nomeUsuario;
    private String numeroTelefone;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Medicamento> medicamentos = new ArrayList<>();

    @OneToMany(mappedBy = "administrador", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Dependente> dependentes = new ArrayList<>();

    public Usuario(@Valid DadosUsuarioCadastro dados) {
        nome = dados.nome();
        email = dados.email();
        tipoConta = dados.categoria();
        numeroTelefone = dados.numeroTelefone();
        senhaHashed = dados.senha();
        dataNascimento = dados.dataNascimento();
        nomeUsuario = dados.nomeUsuario();
    }



}





