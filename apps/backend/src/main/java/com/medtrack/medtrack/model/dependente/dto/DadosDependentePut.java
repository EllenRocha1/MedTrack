package com.medtrack.medtrack.model.dependente.dto;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.validation.EmailValido;
import com.medtrack.medtrack.validation.TelefoneValido;
import com.medtrack.medtrack.validation.ValidationUtils;
import jakarta.validation.constraints.NotNull;

public record DadosDependentePut(
        @NotNull
        Long id,
        String nome,
        @TelefoneValido
        String telefone,
        @EmailValido
        String email,
        @NotNull
        String nomeUsuario,
        @NotNull
        String senhaHashed
) {
    public DadosDependentePut {
        nome = ValidationUtils.trimIfPresent(nome);
        telefone = ValidationUtils.normalizeTelefone(telefone);
        email = ValidationUtils.normalizeEmail(email);
        nomeUsuario = ValidationUtils.trimIfPresent(nomeUsuario);
        senhaHashed = ValidationUtils.trimIfPresent(senhaHashed);
    }

    public DadosDependentePut(Dependente dependente) {
        this(dependente.getId(), dependente.getNome(), dependente.getTelefone(), dependente.getEmail(), dependente.getNomeUsuario(),
                dependente.getSenhaHashed());
    }
}
