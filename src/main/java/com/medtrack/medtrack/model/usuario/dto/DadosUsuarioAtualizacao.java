package com.medtrack.medtrack.model.usuario.dto;

import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.validation.EmailValido;
import com.medtrack.medtrack.validation.TelefoneValido;
import com.medtrack.medtrack.validation.ValidationUtils;

import java.time.LocalDate;

public record DadosUsuarioAtualizacao(
        String nome,
        @EmailValido
        String email,
        String nomeUsuario,
        @TelefoneValido
        String numeroTelefone,
        String senha,
        CategoriaUsuario tipoConta,
        LocalDate dataNascimento
) {
    public DadosUsuarioAtualizacao {
        nome = ValidationUtils.trimIfPresent(nome);
        email = ValidationUtils.normalizeEmail(email);
        numeroTelefone = ValidationUtils.normalizeTelefone(numeroTelefone);
        nomeUsuario = ValidationUtils.trimIfPresent(nomeUsuario);
        senha = ValidationUtils.trimIfPresent(senha);
    }
}

