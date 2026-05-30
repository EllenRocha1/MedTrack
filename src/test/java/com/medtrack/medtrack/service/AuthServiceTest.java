package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosLogin;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private DependenteRepository dependenteRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void deveAutenticarUsuarioNoFluxoWeb() {
        Usuario usuario = new Usuario();
        usuario.setNomeUsuario("web");

        when(usuarioRepository.findByNomeUsuario("web")).thenReturn(Optional.of(usuario));
        when(authenticationManager.authenticate(any()))
                .thenReturn(new TestingAuthenticationToken("web", "123", "ROLE_PESSOAL"));
        when(jwtService.generateToken(any())).thenReturn("jwt-web");

        String token = authService.autenticarUsuario(new DadosLogin("web", "123"));

        assertEquals("jwt-web", token);
    }

    @Test
    void deveFalharQuandoUsuarioWebNaoExiste() {
        when(usuarioRepository.findByNomeUsuario("inexistente")).thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> authService.autenticarUsuario(new DadosLogin("inexistente", "123"))
        );
    }

    @Test
    void deveFalharQuandoAuthenticationManagerNaoAutenticaUsuarioWeb() {
        Usuario usuario = new Usuario();
        usuario.setNomeUsuario("web");
        var authentication = new TestingAuthenticationToken("web", "123");
        authentication.setAuthenticated(false);

        when(usuarioRepository.findByNomeUsuario("web")).thenReturn(Optional.of(usuario));
        when(authenticationManager.authenticate(any())).thenReturn(authentication);

        assertThrows(
                UsernameNotFoundException.class,
                () -> authService.autenticarUsuario(new DadosLogin("web", "123"))
        );
    }

    @Test
    void deveAutenticarUsuarioNoFluxoMobile() {
        Usuario usuario = new Usuario();
        usuario.setNomeUsuario("mobile");
        usuario.setSenhaHashed("hash");

        when(usuarioRepository.findByNomeUsuario("mobile")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("123", "hash")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("jwt");

        String token = authService.autenticarMobile(new DadosLogin("mobile", "123"));

        assertEquals("jwt", token);
    }

    @Test
    void deveAutenticarDependenteNoFluxoMobile() {
        Dependente dependente = new Dependente();
        dependente.setNomeUsuario("dep");
        dependente.setSenhaHashed("hash");

        when(usuarioRepository.findByNomeUsuario("dep")).thenReturn(Optional.empty());
        when(dependenteRepository.findByNomeUsuario("dep")).thenReturn(Optional.of(dependente));
        when(passwordEncoder.matches("123", "hash")).thenReturn(true);
        when(jwtService.generateTokenDependente(any())).thenReturn("jwt-dep");

        String token = authService.autenticarMobile(new DadosLogin("dep", "123"));

        assertEquals("jwt-dep", token);
    }

    @Test
    void deveFalharQuandoSenhaMobileForInvalida() {
        Usuario usuario = new Usuario();
        usuario.setNomeUsuario("mobile");
        usuario.setSenhaHashed("hash");

        when(usuarioRepository.findByNomeUsuario("mobile")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("errada", "hash")).thenReturn(false);

        assertThrows(
                UsernameNotFoundException.class,
                () -> authService.autenticarMobile(new DadosLogin("mobile", "errada"))
        );
    }
}
