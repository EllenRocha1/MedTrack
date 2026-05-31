package com.medtrack.medtrack.controller.mobile;

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
class AuthMobileControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthMobileController authMobileController;

    @Test
    void deveRetornarTokenNoLoginMobile() {
        DadosLogin dados = new DadosLogin("mobile", "123");
        when(authService.autenticarMobile(dados)).thenReturn("jwt-mobile");

        var response = authMobileController.login(dados);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("jwt-mobile", response.getBody().get("token"));
    }

    @Test
    void deveRetornarNaoAutorizadoQuandoLoginMobileFalha() {
        DadosLogin dados = new DadosLogin("mobile", "errada");
        when(authService.autenticarMobile(dados)).thenThrow(new UsernameNotFoundException("falha"));

        var response = authMobileController.login(dados);

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Credenciais invalidas", response.getBody().get("error"));
    }
}
