package com.medtrack.medtrack.model.dependente.dto;

import com.medtrack.medtrack.validation.EmailValido;
import com.medtrack.medtrack.validation.TelefoneValido;
import com.medtrack.medtrack.validation.ValidationUtils;
import jakarta.validation.constraints.NotBlank;

public record DadosDependente(

    @NotBlank
    String nome,

    @NotBlank
    @EmailValido
    String email,

    @NotBlank
    @TelefoneValido
    String telefone,

    Long administradorId,

    @NotBlank
    String nomeUsuario,

    @NotBlank
    String senha
) {
    public DadosDependente {
        nome = ValidationUtils.trimIfPresent(nome);
        email = ValidationUtils.normalizeEmail(email);
        telefone = ValidationUtils.normalizeTelefone(telefone);
        nomeUsuario = ValidationUtils.trimIfPresent(nomeUsuario);
        senha = ValidationUtils.trimIfPresent(senha);
    }

    public DadosDependente withAdministradorId(Long administradorId) {
        return new DadosDependente(
                this.nome,
                this.email,
                this.telefone,
                administradorId,
                this.nomeUsuario,
                this.senha
        );
    }
}
