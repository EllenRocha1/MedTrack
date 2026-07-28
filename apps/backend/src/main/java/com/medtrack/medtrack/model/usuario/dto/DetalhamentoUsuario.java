package com.medtrack.medtrack.model.usuario.dto;

import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.Usuario;

import java.time.LocalDate;

public record DetalhamentoUsuario(long id, CategoriaUsuario tipoConta, String nome, String email,
                                  LocalDate dataNascimento, String nomeUsuario, String numeroTelefone ) {

    public DetalhamentoUsuario(Usuario usuario) {
        this(usuario.getId(), usuario.getTipoConta(), usuario.getNome(), usuario.getEmail(), usuario.getDataNascimento(),
                usuario.getNomeUsuario(), usuario.getNumeroTelefone());
    }
}
