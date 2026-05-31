package com.medtrack.medtrack.controller.mobile;

import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioMobile;
import com.medtrack.medtrack.service.JwtService;
import com.medtrack.medtrack.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioMobileControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UsuarioMobileController usuarioMobileController;

    @Test
    void deveBuscarUsuarioMobileAPartirDoToken() {
        var usuario = new DadosUsuarioMobile(2L, "Usuario", "mobile", "usuario@email.com");

        when(jwtService.extractUsername("jwt")).thenReturn("mobile");
        when(usuarioService.buscarUsuarioMobilePorUsername("mobile")).thenReturn(usuario);

        var response = usuarioMobileController.getUsuario("Bearer jwt");

        assertEquals(200, response.getStatusCode().value());
        assertSame(usuario, response.getBody());
    }
}
