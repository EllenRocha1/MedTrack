package com.medtrack.medtrack.validation;

import com.medtrack.medtrack.model.dependente.dto.DadosDependente;
import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioAtualizacao;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DTOValidationTests {

    private static Validator validator;
    private static ValidatorFactory validatorFactory;

    @BeforeAll
    static void setupValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        validatorFactory.close();
    }

    @Test
    void deveValidarCadastroDeUsuarioComEmailETelefoneValidos() {
        DadosUsuarioCadastro dados = new DadosUsuarioCadastro(
                "Maria Silva",
                "Maria.Silva+teste@example.com ",
                LocalDate.of(1990, 1, 1),
                "+55 (11) 91234-5678",
                "maria",
                "Senha123!",
                CategoriaUsuario.PESSOAL
        );

        Set<ConstraintViolation<DadosUsuarioCadastro>> violacoes = validator.validate(dados);
        assertTrue(violacoes.isEmpty());
        assertEquals("maria.silva+teste@example.com", dados.email());
        assertEquals("+5511912345678", dados.numeroTelefone());
    }

    @Test
    void deveRejeitarCadastroDeUsuarioComEmailETelefoneInvalidos() {
        DadosUsuarioCadastro dados = new DadosUsuarioCadastro(
                "Maria Silva",
                "maria@@example..com",
                LocalDate.of(1990, 1, 1),
                "123",
                "maria",
                "Senha123!",
                CategoriaUsuario.PESSOAL
        );

        Set<ConstraintViolation<DadosUsuarioCadastro>> violacoes = validator.validate(dados);
        assertFalse(violacoes.isEmpty());
        Set<String> mensagens = violacoes.stream().map(ConstraintViolation::getMessage).collect(Collectors.toSet());
        assertTrue(mensagens.contains("E-mail inválido. Informe um endereço de e-mail válido."));
        assertTrue(mensagens.contains("Telefone inválido. Use formato BR ou internacional válido."));
    }

    @Test
    void deveRejeitarAtualizacaoDeUsuarioComTelefoneInvalido() {
        DadosUsuarioAtualizacao dados = new DadosUsuarioAtualizacao(
                null,
                "usuario@example.com",
                null,
                "abc123",
                null,
                null,
                null
        );

        Set<ConstraintViolation<DadosUsuarioAtualizacao>> violacoes = validator.validate(dados);
        assertFalse(violacoes.isEmpty());
        assertEquals(1, violacoes.size());
        ConstraintViolation<DadosUsuarioAtualizacao> violacao = violacoes.iterator().next();
        assertEquals("Telefone inválido. Use formato BR ou internacional válido.", violacao.getMessage());
        assertEquals("numeroTelefone", violacao.getPropertyPath().toString());
    }

    @Test
    void deveValidarCadastroDeDependenteComEmailETelefoneValidos() {
        DadosDependente dependente = new DadosDependente(
                "João Santos",
                "joao.santos@example.com",
                "(21) 98765-4321",
                null,
                "joao",
                "Senha123!"
        );

        Set<ConstraintViolation<DadosDependente>> violacoes = validator.validate(dependente);
        assertTrue(violacoes.isEmpty());
    }

    @Test
    void deveRejeitarCadastroDeDependenteComEmailETelefoneInvalidos() {
        DadosDependente dependente = new DadosDependente(
                "João Santos",
                "joao.example.com",
                "12345",
                null,
                "joao",
                "Senha123!"
        );

        Set<ConstraintViolation<DadosDependente>> violacoes = validator.validate(dependente);
        assertFalse(violacoes.isEmpty());
        Set<String> mensagens = violacoes.stream().map(ConstraintViolation::getMessage).collect(Collectors.toSet());
        assertTrue(mensagens.contains("E-mail inválido. Informe um endereço de e-mail válido."));
        assertTrue(mensagens.contains("Telefone inválido. Use formato BR ou internacional válido."));
    }
}
