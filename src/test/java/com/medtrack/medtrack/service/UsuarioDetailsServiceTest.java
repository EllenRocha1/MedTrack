package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioDetailsServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private DependenteRepository dependenteRepository;

    @InjectMocks
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveCarregarUsuarioPrincipalPorNomeUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNomeUsuario("admin");
        usuario.setSenhaHashed("hash");
        usuario.setTipoConta(CategoriaUsuario.ADMINISTRADOR);

        when(usuarioRepository.findByNomeUsuario("admin")).thenReturn(Optional.of(usuario));

        var userDetails = usuarioDetailsService.loadUserByUsername("admin");

        assertEquals("admin", userDetails.getUsername());
        assertEquals("hash", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMINISTRADOR")));
    }

    @Test
    void deveCarregarDependenteQuandoUsuarioPrincipalNaoExiste() {
        Dependente dependente = new Dependente();
        dependente.setNomeUsuario("dep");
        dependente.setSenhaHashed("hash-dep");

        when(usuarioRepository.findByNomeUsuario("dep")).thenReturn(Optional.empty());
        when(dependenteRepository.findByNomeUsuario("dep")).thenReturn(Optional.of(dependente));

        var userDetails = usuarioDetailsService.loadUserByUsername("dep");

        assertEquals("dep", userDetails.getUsername());
        assertEquals("hash-dep", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_DEPENDENTE")));
    }

    @Test
    void deveFalharQuandoUsuarioEDependenteNaoExistem() {
        when(usuarioRepository.findByNomeUsuario("ausente")).thenReturn(Optional.empty());
        when(dependenteRepository.findByNomeUsuario("ausente")).thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> usuarioDetailsService.loadUserByUsername("ausente")
        );
    }
}
