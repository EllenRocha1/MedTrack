package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependentePut;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import com.medtrack.medtrack.util.exception.AdministradorNaoEncontradoException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DependenteServiceTest {

    @Mock
    private DependenteRepository dependenteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private DependenteService dependenteService;

    @Test
    void deveCadastrarDependenteComAdministradorESenhaCriptografada() {
        DadosDependente dados = dadosDependente(null);
        Usuario administrador = new Usuario();

        when(usuarioRepository.existsByNomeUsuario("dependente")).thenReturn(false);
        when(dependenteRepository.existsByNomeUsuario("dependente")).thenReturn(false);
        when(usuarioService.buscarPorId(1L)).thenReturn(Optional.of(administrador));
        when(passwordEncoder.encode("123")).thenReturn("hash");
        when(dependenteRepository.save(any(Dependente.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Dependente dependente = dependenteService.cadastrar(dados, 1L);

        assertEquals("Dependente", dependente.getNome());
        assertSame(administrador, dependente.getAdministrador());
        assertEquals("hash", dependente.getSenhaHashed());
    }

    @Test
    void deveBloquearCadastroQuandoNomeUsuarioJaExiste() {
        DadosDependente dados = dadosDependente(1L);
        when(usuarioRepository.existsByNomeUsuario("dependente")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> dependenteService.cadastrar(dados, 1L));
        verify(dependenteRepository, never()).save(any());
    }

    @Test
    void deveFalharQuandoAdministradorNaoExiste() {
        DadosDependente dados = dadosDependente(null);

        when(usuarioRepository.existsByNomeUsuario("dependente")).thenReturn(false);
        when(dependenteRepository.existsByNomeUsuario("dependente")).thenReturn(false);
        when(usuarioService.buscarPorId(1L)).thenReturn(Optional.empty());

        assertThrows(AdministradorNaoEncontradoException.class, () -> dependenteService.cadastrar(dados, 1L));
    }

    @Test
    void deveListarDependentesUsandoAdministradorExtraidoDoToken() {
        List<Dependente> dependentes = List.of(new Dependente());

        when(jwtService.extractUsername("jwt")).thenReturn("admin");
        when(usuarioRepository.getIdByNomeUsuario("admin")).thenReturn(Optional.of(1L));
        when(dependenteRepository.findByAdministradorId(1L)).thenReturn(dependentes);

        assertSame(dependentes, dependenteService.listarPorToken("Bearer jwt"));
    }

    @Test
    void deveFalharQuandoTokenNaoPertenceAAdministrador() {
        when(jwtService.extractUsername("jwt")).thenReturn("admin");
        when(usuarioRepository.getIdByNomeUsuario("admin")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> dependenteService.listarPorToken("Bearer jwt"));
    }

    @Test
    void deveAtualizarDadosDoDependente() {
        Dependente dependente = dependente();
        DadosDependentePut dados = new DadosDependentePut(
                5L,
                "Novo Nome",
                "+5581888888888",
                "novo@email.com",
                "novoUsuario",
                "novaHash"
        );

        when(dependenteRepository.getReferenceById(5L)).thenReturn(dependente);
        when(usuarioRepository.existsByNomeUsuario("novoUsuario")).thenReturn(false);
        when(dependenteRepository.existsByNomeUsuario("novoUsuario")).thenReturn(false);

        Dependente atualizado = dependenteService.atualizar(dados);

        assertSame(dependente, atualizado);
        assertEquals("Novo Nome", atualizado.getNome());
        assertEquals("novoUsuario", atualizado.getNomeUsuario());
        assertEquals("novaHash", atualizado.getSenhaHashed());
    }

    @Test
    void deveBloquearAtualizacaoQuandoNovoNomeUsuarioJaExiste() {
        Dependente dependente = dependente();
        DadosDependentePut dados = new DadosDependentePut(
                5L,
                null,
                null,
                null,
                "duplicado",
                "hash"
        );

        when(dependenteRepository.getReferenceById(5L)).thenReturn(dependente);
        when(usuarioRepository.existsByNomeUsuario("duplicado")).thenReturn(false);
        when(dependenteRepository.existsByNomeUsuario("duplicado")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> dependenteService.atualizar(dados));
    }

    private DadosDependente dadosDependente(Long administradorId) {
        return new DadosDependente(
                "Dependente",
                "dependente@email.com",
                "+5581999999999",
                administradorId,
                "dependente",
                "123"
        );
    }

    private Dependente dependente() {
        Dependente dependente = new Dependente();
        dependente.setId(5L);
        dependente.setNome("Dependente");
        dependente.setEmail("dependente@email.com");
        dependente.setTelefone("81999999999");
        dependente.setNomeUsuario("dependente");
        dependente.setSenhaHashed("hash");
        return dependente;
    }
}
