package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.dependente.DependenteDetails;
import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.UsuarioDetails;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService();

    @Test
    void deveGerarTokenDeUsuarioEValidarUsername() {
        Usuario usuario = usuario("mobile");
        String token = jwtService.generateToken(new UsuarioDetails(usuario));

        assertEquals("mobile", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, new UsuarioDetails(usuario)));
    }

    @Test
    void deveRetornarTokenInvalidoQuandoUsernameDiverge() {
        Usuario usuario = usuario("mobile");
        String token = jwtService.generateToken(new UsuarioDetails(usuario));
        var outroUsuario = new User("outro", "hash", Collections.emptyList());

        assertFalse(jwtService.isTokenValid(token, outroUsuario));
    }

    @Test
    void deveGerarTokenDeDependenteEExtrairUsername() {
        Dependente dependente = new Dependente();
        dependente.setNome("Dependente");
        dependente.setNomeUsuario("dependente");
        dependente.setEmail("dependente@email.com");
        dependente.setTelefone("81999999999");

        String token = jwtService.generateTokenDependente(new DependenteDetails(dependente));

        assertEquals("dependente", jwtService.extractUsername(token));
    }

    private Usuario usuario(String nomeUsuario) {
        Usuario usuario = new Usuario();
        usuario.setId(2L);
        usuario.setNome("Usuario");
        usuario.setNomeUsuario(nomeUsuario);
        usuario.setEmail("usuario@email.com");
        usuario.setTipoConta(CategoriaUsuario.PESSOAL);
        usuario.setSenhaHashed("hash");
        return usuario;
    }
}
