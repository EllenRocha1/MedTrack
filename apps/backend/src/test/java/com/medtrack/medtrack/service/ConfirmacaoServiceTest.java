package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.repository.ConfirmacaoRepository;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConfirmacaoServiceTest {

    @Mock
    private ConfirmacaoRepository confirmacaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private MedicamentoRepository medicamentoRepository;

    @InjectMocks
    private ConfirmacaoService confirmacaoService;

    @Test
    void deveSalvarConfirmacaoComImagem() {
        Usuario usuario = new Usuario();
        Medicamento medicamento = new Medicamento();
        DadosConfirmacao dados = dadosConfirmacao();

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(medicamentoRepository.findById(6L)).thenReturn(Optional.of(medicamento));
        when(confirmacaoRepository.save(any(Confirmacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Confirmacao confirmacao = confirmacaoService.salvarConfirmacao(dados, "https://cdn/imagem.jpg");

        assertSame(usuario, confirmacao.getUsuario());
        assertSame(medicamento, confirmacao.getMedicamento());
        assertEquals("https://cdn/imagem.jpg", confirmacao.getComprovanteImagemUrl());
        assertEquals(LocalTime.of(8, 30), confirmacao.getHorario());
        verify(confirmacaoRepository).save(any(Confirmacao.class));
    }

    @Test
    void deveFalharQuandoUsuarioNaoExiste() {
        DadosConfirmacao dados = dadosConfirmacao();
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> confirmacaoService.salvarConfirmacao(dados)
        );

        assertEquals("Usuario nao encontrado", exception.getMessage());
    }

    @Test
    void deveFalharQuandoMedicamentoNaoExiste() {
        DadosConfirmacao dados = dadosConfirmacao();
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(new Usuario()));
        when(medicamentoRepository.findById(6L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> confirmacaoService.salvarConfirmacao(dados)
        );

        assertEquals("Medicamento nao encontrado", exception.getMessage());
    }

    @Test
    void deveDelegarListagensParaRepository() {
        var confirmacoes = List.of(new Confirmacao());
        when(confirmacaoRepository.findByMedicamentoUsuarioId(1L)).thenReturn(confirmacoes);
        when(confirmacaoRepository.findByMedicamentoDependenteId(2L)).thenReturn(confirmacoes);
        when(confirmacaoRepository.findByMedicamentoId(6L)).thenReturn(confirmacoes);

        assertSame(confirmacoes, confirmacaoService.listarConfirmacoesDoUsuario(1L));
        assertSame(confirmacoes, confirmacaoService.listarConfirmacoesDoDependente(2L));
        assertSame(confirmacoes, confirmacaoService.listarConfirmacoesDoMedicamento(6L));
    }

    private DadosConfirmacao dadosConfirmacao() {
        return new DadosConfirmacao(
                1L,
                6L,
                LocalTime.of(8, 30),
                LocalDate.of(2026, 5, 24),
                true,
                "tomou com agua"
        );
    }
}
