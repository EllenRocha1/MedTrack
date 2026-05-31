package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.usuario.dto.DadosLogin;
import com.medtrack.medtrack.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void deveRetornarTokenNoLoginWeb() {
        DadosLogin dados = new DadosLogin("usuario", "123");
        when(authService.autenticarUsuario(dados)).thenReturn("jwt");

        var response = authController.login(dados);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("jwt", response.getBody().get("token"));
    }

    @Test
    void deveRetornarNaoAutorizadoQuandoLoginWebFalha() {
        DadosLogin dados = new DadosLogin("usuario", "errada");
        when(authService.autenticarUsuario(dados)).thenThrow(new UsernameNotFoundException("falha"));

        var response = authController.login(dados);

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Falha na autenticacao", response.getBody().get("error"));
    }
}
