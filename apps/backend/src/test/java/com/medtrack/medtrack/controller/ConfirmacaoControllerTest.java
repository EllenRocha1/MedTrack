package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.service.CloudinaryService;
import com.medtrack.medtrack.service.ConfirmacaoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConfirmacaoControllerTest {

    @Mock
    private ConfirmacaoService confirmacaoService;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private ConfirmacaoController confirmacaoController;

    @Test
    void deveConfirmarMedicamentoComJson() {
        DadosConfirmacao dados = dadosConfirmacao();
        when(confirmacaoService.salvarConfirmacao(dados)).thenReturn(confirmacao("https://cdn/foto.jpg"));

        var response = confirmacaoController.confirmarMedicamento(dados);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void deveRetornarBadRequestQuandoConfirmacaoJsonFalha() {
        DadosConfirmacao dados = dadosConfirmacao();
        when(confirmacaoService.salvarConfirmacao(dados)).thenThrow(new RuntimeException("erro"));

        var response = confirmacaoController.confirmarMedicamento(dados);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Erro ao confirmar medicamento: erro", response.getBody());
    }

    @Test
    void deveConfirmarMedicamentoComImagem() {
        DadosConfirmacao dados = dadosConfirmacao();
        var imagem = new MockMultipartFile("imagem", "foto.jpg", "image/jpeg", new byte[]{1, 2, 3});

        when(cloudinaryService.uploadImagem(imagem)).thenReturn("https://cdn/foto.jpg");
        when(confirmacaoService.salvarConfirmacao(dados, "https://cdn/foto.jpg"))
                .thenReturn(confirmacao("https://cdn/foto.jpg"));

        var response = confirmacaoController.confirmarMedicamentoComImagem(dados, imagem);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void deveListarConfirmacoesPorUsuarioDependenteEMedicamento() {
        var confirmacoes = List.of(confirmacao(null));

        when(confirmacaoService.listarConfirmacoesDoUsuario(1L)).thenReturn(confirmacoes);
        when(confirmacaoService.listarConfirmacoesDoDependente(2L)).thenReturn(confirmacoes);
        when(confirmacaoService.listarConfirmacoesDoMedicamento(6L)).thenReturn(confirmacoes);

        assertEquals(200, confirmacaoController.listarPorUsuario(1L).getStatusCode().value());
        assertEquals(200, confirmacaoController.listarPorDependente(2L).getStatusCode().value());
        assertEquals(200, confirmacaoController.listarPorMedicamento(6L).getStatusCode().value());
    }

    @Test
    void deveRetornarErroInternoQuandoListagemFalha() {
        when(confirmacaoService.listarConfirmacoesDoUsuario(1L)).thenThrow(new RuntimeException("erro"));

        var response = confirmacaoController.listarPorUsuario(1L);

        assertEquals(500, response.getStatusCode().value());
    }

    private DadosConfirmacao dadosConfirmacao() {
        return new DadosConfirmacao(
                1L,
                6L,
                LocalTime.of(8, 30),
                LocalDate.of(2026, 5, 24),
                true,
                "ok"
        );
    }

    private Confirmacao confirmacao(String imagemUrl) {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        Medicamento medicamento = new Medicamento();
        medicamento.setId(6L);

        Confirmacao confirmacao = new Confirmacao();
        confirmacao.setId(3L);
        confirmacao.setUsuario(usuario);
        confirmacao.setMedicamento(medicamento);
        confirmacao.setHorario(LocalTime.of(8, 30));
        confirmacao.setData(LocalDate.of(2026, 5, 24));
        confirmacao.setFoiTomado(true);
        confirmacao.setObservacao("ok");
        confirmacao.setComprovanteImagemUrl(imagemUrl);
        return confirmacao;
    }
}
