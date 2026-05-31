package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioAtualizacao;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private DependenteRepository dependenteRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void deveCadastrarUsuarioComSenhaCriptografada() {
        DadosUsuarioCadastro dados = dadosUsuarioCadastro();

        when(usuarioRepository.existsByNomeUsuario("maria")).thenReturn(false);
        when(dependenteRepository.existsByNomeUsuario("maria")).thenReturn(false);
        when(passwordEncoder.encode("senha")).thenReturn("hash");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario usuario = usuarioService.cadastrarUsuario(dados);

        assertEquals("hash", usuario.getSenhaHashed());
        assertEquals("maria", usuario.getNomeUsuario());
    }

    @Test
    void deveBloquearNomeUsuarioJaUsadoPorDependente() {
        DadosUsuarioCadastro dados = dadosUsuarioCadastro();

        when(usuarioRepository.existsByNomeUsuario("maria")).thenReturn(false);
        when(dependenteRepository.existsByNomeUsuario("maria")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> usuarioService.cadastrarUsuario(dados));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void deveBuscarUsuarioMobilePorUsername() {
        Usuario usuario = usuario();
        when(usuarioRepository.findByNomeUsuario("maria")).thenReturn(Optional.of(usuario));

        var dados = usuarioService.buscarUsuarioMobilePorUsername("maria");

        assertEquals(usuario.getId(), dados.id());
        assertEquals("maria", dados.nomeUsuario());
    }

    @Test
    void deveBuscarDependenteMobileQuandoUsuarioNaoExiste() {
        Dependente dependente = new Dependente();
        dependente.setId(9L);
        dependente.setNome("Dependente");
        dependente.setNomeUsuario("dep");
        dependente.setEmail("dep@email.com");

        when(usuarioRepository.findByNomeUsuario("dep")).thenReturn(Optional.empty());
        when(dependenteRepository.findByNomeUsuario("dep")).thenReturn(Optional.of(dependente));

        var dados = usuarioService.buscarUsuarioMobilePorUsername("dep");

        assertEquals(9L, dados.id());
        assertEquals("dep", dados.nomeUsuario());
    }

    @Test
    void deveFalharQuandoUsuarioMobileNaoExiste() {
        when(usuarioRepository.findByNomeUsuario("ausente")).thenReturn(Optional.empty());
        when(dependenteRepository.findByNomeUsuario("ausente")).thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> usuarioService.buscarUsuarioMobilePorUsername("ausente")
        );
    }

    @Test
    void deveListarUsuariosPaginadosComoDetalhamento() {
        Usuario usuario = usuario();
        var pageable = PageRequest.of(0, 10);

        when(usuarioRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(usuario)));

        var pagina = usuarioService.listar(pageable);

        assertEquals(1, pagina.getTotalElements());
        assertEquals("Maria", pagina.getContent().getFirst().nome());
    }

    @Test
    void deveDetalharUsuarioExistente() {
        Usuario usuario = usuario();
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        var detalhes = usuarioService.detalhar(1L);

        assertEquals("Maria", detalhes.nome());
        assertEquals("maria", detalhes.nomeUsuario());
    }

    @Test
    void deveAtualizarUsuarioComSenhaCriptografada() {
        Usuario usuario = usuario();
        DadosUsuarioAtualizacao dados = new DadosUsuarioAtualizacao(
                "Maria Nova",
                "nova@example.com",
                "mariaNova",
                "+5581888888888",
                "novaSenha",
                CategoriaUsuario.ADMINISTRADOR,
                LocalDate.of(1991, 2, 2)
        );

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByNomeUsuario("mariaNova")).thenReturn(false);
        when(dependenteRepository.existsByNomeUsuario("mariaNova")).thenReturn(false);
        when(passwordEncoder.encode("novaSenha")).thenReturn("novaHash");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario atualizado = usuarioService.atualizarUsuario(1L, dados);

        assertEquals("Maria Nova", atualizado.getNome());
        assertEquals("mariaNova", atualizado.getNomeUsuario());
        assertEquals("novaHash", atualizado.getSenhaHashed());
        assertEquals(CategoriaUsuario.ADMINISTRADOR, atualizado.getTipoConta());
    }

    @Test
    void deveBloquearAtualizacaoComNomeUsuarioDuplicado() {
        Usuario usuario = usuario();
        DadosUsuarioAtualizacao dados = new DadosUsuarioAtualizacao(
                null,
                null,
                "duplicado",
                null,
                null,
                null,
                null
        );

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByNomeUsuario("duplicado")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> usuarioService.atualizarUsuario(1L, dados));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void deveDeletarUsuarioQuandoExiste() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);

        usuarioService.deletarUsuario(1L);

        verify(usuarioRepository).deleteById(1L);
    }

    @Test
    void deveFalharAoDeletarUsuarioInexistente() {
        when(usuarioRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> usuarioService.deletarUsuario(1L));
    }

    private DadosUsuarioCadastro dadosUsuarioCadastro() {
        return new DadosUsuarioCadastro(
                "Maria",
                "maria@example.com",
                LocalDate.of(1990, 1, 1),
                "+5581999999999",
                "maria",
                "senha",
                CategoriaUsuario.PESSOAL
        );
    }

    private Usuario usuario() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Maria");
        usuario.setNomeUsuario("maria");
        usuario.setEmail("maria@example.com");
        usuario.setNumeroTelefone("81999999999");
        usuario.setDataNascimento(LocalDate.of(1990, 1, 1));
        usuario.setTipoConta(CategoriaUsuario.PESSOAL);
        usuario.setSenhaHashed("hash");
        return usuario;
    }
}
