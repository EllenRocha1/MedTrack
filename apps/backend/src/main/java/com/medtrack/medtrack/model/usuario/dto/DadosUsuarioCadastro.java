package com.medtrack.medtrack.model.usuario.dto;

import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.validation.EmailValido;
import com.medtrack.medtrack.validation.TelefoneValido;
import com.medtrack.medtrack.validation.ValidationUtils;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DadosUsuarioCadastro(

        @NotBlank
        String nome,

        @NotBlank
        @EmailValido
        String email,

        @NotNull
        LocalDate dataNascimento,

        @NotBlank
        @TelefoneValido
        String numeroTelefone,

        @NotBlank
        String nomeUsuario,

        @NotBlank
        String senha,

        @NotNull
        CategoriaUsuario categoria
) {
    public DadosUsuarioCadastro {
        nome = ValidationUtils.trimIfPresent(nome);
        email = ValidationUtils.normalizeEmail(email);
        numeroTelefone = ValidationUtils.normalizeTelefone(numeroTelefone);
        nomeUsuario = ValidationUtils.trimIfPresent(nomeUsuario);
        senha = ValidationUtils.trimIfPresent(senha);
    }
}
