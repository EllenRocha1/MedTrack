package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.medicamento.Estoque;
import com.medtrack.medtrack.model.medicamento.FrequenciaUso;
import com.medtrack.medtrack.model.medicamento.FrequenciaUsoTipo;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosEstoque;
import com.medtrack.medtrack.model.medicamento.dto.DadosEstoquePut;
import com.medtrack.medtrack.model.medicamento.dto.DadosFrequenciaUso;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.Usuario;
import jakarta.persistence.EntityNotFoundException;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.FrequenciaUsoRepository;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import com.medtrack.medtrack.util.exception.DuplicidadeMedicamentoException;
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
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicamentoServiceTest {

    @Mock
    private MedicamentoRepository medicamentoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private DependenteRepository dependenteRepository;

    @Mock
    private FrequenciaUsoRepository frequenciaUsoRepository;

    @InjectMocks
    private MedicamentoService medicamentoService;

    @Test
    void deveBloquearCadastroComPrincipioAtivoDuplicadoNoMesmoUsuario() {
        DadosMedicamento dados = dadosMedicamento(false);
        Medicamento existente = medicamentoExistente(10L, "Losartana Potássica");

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario(3L)));
        when(medicamentoRepository.findByUsuarioIdAndDependenteIsNull(3L)).thenReturn(List.of(existente));

        DuplicidadeMedicamentoException exception = assertThrows(
                DuplicidadeMedicamentoException.class,
                () -> medicamentoService.criarMedicamento(dados)
        );

        assertEquals(10L, exception.getDadosDuplicidade().medicamentoExistenteId());
        assertEquals("Losartana Potássica", exception.getDadosDuplicidade().principioAtivoConflitante());
        verify(medicamentoRepository, never()).save(any());
    }

    @Test
    void devePermitirCadastroDuplicadoQuandoConfirmadoExplicitamente() {
        DadosMedicamento dados = dadosMedicamento(true);
        Usuario usuario = usuario(3L);

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario));
        when(frequenciaUsoRepository.save(any(FrequenciaUso.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(medicamentoRepository.save(any(Medicamento.class))).thenAnswer(invocation -> {
            Medicamento medicamento = invocation.getArgument(0);
            medicamento.setId(20L);
            return medicamento;
        });

        Medicamento medicamento = medicamentoService.criarMedicamento(dados);

        assertEquals(20L, medicamento.getId());
        assertEquals("LOSARTANA POTASSICA", medicamento.getPrincipioAtivo());
        verify(medicamentoRepository, never()).findByUsuarioIdAndDependenteIsNull(3L);
    }

    @Test
    void deveCriarMedicamentoParaDependenteComFrequenciaExistente() {
        DadosMedicamento dados = dadosMedicamento(false, 4L, 8L, "METFORMINA");
        Usuario usuario = usuario(3L);
        Dependente dependente = dependente(4L);
        FrequenciaUso frequenciaUso = frequenciaContinua();

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario));
        when(dependenteRepository.findById(4L)).thenReturn(Optional.of(dependente));
        when(medicamentoRepository.findByDependenteId(4L)).thenReturn(List.of());
        when(frequenciaUsoRepository.findById(8L)).thenReturn(Optional.of(frequenciaUso));
        when(medicamentoRepository.save(any(Medicamento.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Medicamento medicamento = medicamentoService.criarMedicamento(dados);

        assertEquals("METFORMINA", medicamento.getPrincipioAtivo());
        assertEquals(frequenciaUso, medicamento.getFrequenciaUso());
        assertEquals(dependente, medicamento.getDependente());
    }

    @Test
    void deveFalharAoCriarMedicamentoQuandoUsuarioNaoExiste() {
        DadosMedicamento dados = dadosMedicamento(false);
        when(usuarioRepository.findById(3L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> medicamentoService.criarMedicamento(dados)
        );

        assertTrue(exception.getMessage().contains("não encontrado"));
    }

    @Test
    void deveFalharAoCriarMedicamentoQuandoDependenteNaoExiste() {
        DadosMedicamento dados = dadosMedicamento(false, 4L, null, "METFORMINA");

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario(3L)));
        when(dependenteRepository.findById(4L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> medicamentoService.criarMedicamento(dados)
        );

        assertTrue(exception.getMessage().contains("não encontrado"));
    }

    @Test
    void deveFalharAoCriarMedicamentoQuandoFrequenciaExistenteNaoExiste() {
        DadosMedicamento dados = dadosMedicamento(false, null, 8L, "METFORMINA");

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario(3L)));
        when(medicamentoRepository.findByUsuarioIdAndDependenteIsNull(3L)).thenReturn(List.of());
        when(frequenciaUsoRepository.findById(8L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> medicamentoService.criarMedicamento(dados)
        );

        assertTrue(exception.getMessage().contains("não encontrada"));
    }

    @Test
    void deveIgnorarVerificacaoDeDuplicidadeQuandoPrincipioAtivoEstaEmBranco() {
        DadosMedicamento dados = dadosMedicamento(false, null, null, "   ");

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario(3L)));
        when(frequenciaUsoRepository.save(any(FrequenciaUso.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(medicamentoRepository.save(any(Medicamento.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Medicamento medicamento = medicamentoService.criarMedicamento(dados);

        assertEquals("   ", medicamento.getPrincipioAtivo());
        verify(medicamentoRepository, never()).findByUsuarioIdAndDependenteIsNull(3L);
    }

    @Test
    void deveBloquearCadastroComPrincipioAtivoDuplicadoNoMesmoDependente() {
        DadosMedicamento dados = dadosMedicamento(false, 4L, null, "Losartana Potassica");
        Medicamento existente = medicamentoExistente(10L, "Losartana Potassica");

        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario(3L)));
        when(dependenteRepository.findById(4L)).thenReturn(Optional.of(dependente(4L)));
        when(medicamentoRepository.findByDependenteId(4L)).thenReturn(List.of(existente));

        assertThrows(DuplicidadeMedicamentoException.class, () -> medicamentoService.criarMedicamento(dados));
        verify(medicamentoRepository, never()).save(any());
    }

    @Test
    void deveConsumirDoseQuandoMedicamentoPossuiEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setEstoque(new Estoque(3, 1, medicamento));

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        var estoque = medicamentoService.consumirDose(7L);

        assertEquals(2, estoque.quantidadeAtual());
    }

    @Test
    void deveReporEstoqueQuandoMedicamentoPossuiEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setEstoque(new Estoque(3, 1, medicamento));

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        var estoque = medicamentoService.reporEstoque(7L, 5);

        assertEquals(8, estoque.quantidadeAtual());
    }

    @Test
    void deveFalharAoConsumirMedicamentoSemEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> medicamentoService.consumirDose(7L)
        );

        assertTrue(exception.getMessage().contains("estoque"));
    }

    @Test
    void deveFalharAoReporMedicamentoSemEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> medicamentoService.reporEstoque(7L, 5)
        );

        assertTrue(exception.getMessage().contains("estoque"));
    }

    @Test
    void deveListarMedicamentosPorUsuarioEDependente() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        when(medicamentoRepository.findByUsuarioId(3L)).thenReturn(List.of(medicamento));
        when(medicamentoRepository.findByDependenteId(4L)).thenReturn(List.of(medicamento));

        assertEquals(1, medicamentoService.listarPorUsuario(3L).size());
        assertEquals(1, medicamentoService.listarPorDependente(4L).size());
    }

    @Test
    void deveListarEstoqueCriticoComoDto() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setEstoque(new Estoque(1, 2, medicamento));
        when(medicamentoRepository.findEstoqueBaixoByUsuarioId(3L)).thenReturn(List.of(medicamento));

        var lista = medicamentoService.listarEstoqueCriticoDto(3L);

        assertEquals(1, lista.size());
        assertEquals("Dipirona", lista.getFirst().nome());
        assertTrue(lista.getFirst().estoque().estoqueBaixo());
    }

    @Test
    void deveDetalharMedicamento() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        var detalhes = medicamentoService.detalhar(7L);

        assertEquals(7L, detalhes.id());
        assertEquals("Dipirona", detalhes.nome());
    }

    @Test
    void deveFalharAoDetalharMedicamentoInexistente() {
        when(medicamentoRepository.findById(7L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> medicamentoService.detalhar(7L));
    }

    @Test
    void deveDeletarMedicamentoERemoverDaListaDoUsuario() {
        Usuario usuario = usuario(3L);
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setUsuario(usuario);
        usuario.getMedicamentos().add(medicamento);

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        medicamentoService.deletarMedicamento(7L);

        assertTrue(usuario.getMedicamentos().isEmpty());
        verify(medicamentoRepository).delete(medicamento);
    }

    @Test
    void deveDeletarMedicamentoSemUsuarioAssociado() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        medicamentoService.deletarMedicamento(7L);

        verify(medicamentoRepository).delete(medicamento);
    }

    @Test
    void deveFalharAoDeletarMedicamentoInexistente() {
        when(medicamentoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> medicamentoService.deletarMedicamento(99L));
    }

    @Test
    void deveAtualizarEstoqueEImagemDoMedicamento() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setEstoque(new Estoque(3, 1, medicamento));
        DadosMedicamentoPut dados = new DadosMedicamentoPut(
                3L,
                "Dipirona gotas",
                null,
                null,
                null,
                "https://cdn/antiga.jpg",
                new DadosEstoquePut(10, 2),
                null
        );

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));
        when(medicamentoRepository.save(any(Medicamento.class))).thenAnswer(invocation -> invocation.getArgument(0));

        medicamentoService.atualizarMedicamento(dados, 7L);
        Medicamento atualizado = medicamentoService.atualizarImagem(7L, "https://cdn/nova.jpg");

        assertEquals("Dipirona gotas", atualizado.getNome());
        assertEquals(10, atualizado.getEstoque().getQuantidadeAtual());
        assertEquals(2, atualizado.getEstoque().getQuantidadeMinima());
        assertEquals("https://cdn/nova.jpg", atualizado.getImagemUrl());
    }

    @Test
    void deveAtualizarApenasQuantidadeMinimaDoEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setEstoque(new Estoque(3, 1, medicamento));
        DadosMedicamentoPut dados = new DadosMedicamentoPut(
                3L,
                null,
                null,
                null,
                null,
                null,
                new DadosEstoquePut(null, 2),
                null
        );

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        medicamentoService.atualizarMedicamento(dados, 7L);

        assertEquals(3, medicamento.getEstoque().getQuantidadeAtual());
        assertEquals(2, medicamento.getEstoque().getQuantidadeMinima());
    }

    @Test
    void deveAtualizarApenasQuantidadeAtualDoEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setEstoque(new Estoque(3, 1, medicamento));
        DadosMedicamentoPut dados = new DadosMedicamentoPut(
                3L,
                null,
                null,
                null,
                null,
                null,
                new DadosEstoquePut(10, null),
                null
        );

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        medicamentoService.atualizarMedicamento(dados, 7L);

        assertEquals(10, medicamento.getEstoque().getQuantidadeAtual());
        assertEquals(1, medicamento.getEstoque().getQuantidadeMinima());
    }

    @Test
    void deveAtualizarMedicamentoMesmoSemDadosDeEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        DadosMedicamentoPut dados = new DadosMedicamentoPut(
                3L,
                "Dipirona sem estoque",
                null,
                null,
                null,
                null,
                null,
                null
        );

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        medicamentoService.atualizarMedicamento(dados, 7L);

        assertEquals("Dipirona sem estoque", medicamento.getNome());
        verify(medicamentoRepository).save(medicamento);
    }

    @Test
    void deveIgnorarAtualizacaoDeEstoqueQuandoMedicamentoNaoPossuiEstoque() {
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        DadosMedicamentoPut dados = new DadosMedicamentoPut(
                3L,
                null,
                null,
                null,
                null,
                null,
                new DadosEstoquePut(10, 2),
                null
        );

        when(medicamentoRepository.findById(7L)).thenReturn(Optional.of(medicamento));

        medicamentoService.atualizarMedicamento(dados, 7L);

        verify(medicamentoRepository).save(medicamento);
    }

    @Test
    void deveListarMedicamentosMobileParaUsuario() {
        Usuario usuario = usuario(3L);
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setFrequenciaUso(frequenciaContinua());

        when(usuarioRepository.findByNomeUsuario("usuario")).thenReturn(Optional.of(usuario));
        when(medicamentoRepository.findByUsuarioId(3L)).thenReturn(List.of(medicamento));

        var lista = medicamentoService.listarMedicamentosMobilePorUsuario("usuario");

        assertEquals(1, lista.size());
        assertEquals("Dipirona", lista.getFirst().compostoAtivo());
    }

    @Test
    void deveListarMedicamentosMobileParaDependente() {
        Dependente dependente = dependente(4L);
        Medicamento medicamento = medicamentoExistente(7L, "Dipirona");
        medicamento.setFrequenciaUso(frequenciaContinua());

        when(usuarioRepository.findByNomeUsuario("dependente")).thenReturn(Optional.empty());
        when(dependenteRepository.findByNomeUsuario("dependente")).thenReturn(Optional.of(dependente));
        when(medicamentoRepository.findByDependenteId(4L)).thenReturn(List.of(medicamento));

        var lista = medicamentoService.listarMedicamentosMobilePorUsuario("dependente");

        assertEquals(1, lista.size());
        assertEquals("Dipirona", lista.getFirst().compostoAtivo());
    }

    @Test
    void deveFalharAoListarMedicamentosMobileSemUsuarioOuDependente() {
        when(usuarioRepository.findByNomeUsuario("ausente")).thenReturn(Optional.empty());
        when(dependenteRepository.findByNomeUsuario("ausente")).thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> medicamentoService.listarMedicamentosMobilePorUsuario("ausente")
        );
    }

    @Test
    void deveMontarDashboardPessoalComEstoqueCriticoEProximasDoses() {
        Medicamento continuo = medicamentoExistente(7L, "Dipirona");
        continuo.setFrequenciaUso(frequenciaContinua());
        Medicamento finalizado = medicamentoExistente(8L, "Ibuprofeno");
        finalizado.setFrequenciaUso(frequenciaComPeriodo(LocalDate.now().minusDays(10), LocalDate.now().minusDays(1)));

        when(medicamentoRepository.countByUsuarioId(3L)).thenReturn(2L);
        when(medicamentoRepository.findEstoqueBaixoByUsuarioId(3L)).thenReturn(List.of(continuo));
        when(medicamentoRepository.findByUsuarioId(3L)).thenReturn(List.of(continuo, finalizado));

        var dashboard = medicamentoService.obterDadosDashboardPessoal(3L);

        assertEquals(2L, dashboard.medicamentosAtivos());
        assertEquals(1L, dashboard.reposicoesUrgentes());
        assertEquals(1L, dashboard.proximasDoses());
        assertEquals(1, dashboard.listaMedicamentosHoje().size());
    }

    @Test
    void deveMontarDashboardConsiderandoPeriodosAtivosInativosENulos() {
        Medicamento semFrequencia = medicamentoExistente(7L, "Sem frequencia");
        Medicamento futuro = medicamentoExistente(8L, "Futuro");
        futuro.setFrequenciaUso(frequenciaComPeriodo(LocalDate.now().plusDays(1), null));
        Medicamento semTermino = medicamentoExistente(9L, "Sem termino");
        semTermino.setFrequenciaUso(frequenciaComPeriodo(LocalDate.now().minusDays(1), null));
        Medicamento semInicio = medicamentoExistente(10L, "Sem inicio");
        semInicio.setFrequenciaUso(frequenciaComPeriodo(null, LocalDate.now().plusDays(1)));

        when(medicamentoRepository.countByUsuarioId(3L)).thenReturn(4L);
        when(medicamentoRepository.findEstoqueBaixoByUsuarioId(3L)).thenReturn(List.of());
        when(medicamentoRepository.findByUsuarioId(3L))
                .thenReturn(List.of(semFrequencia, futuro, semTermino, semInicio));

        var dashboard = medicamentoService.obterDadosDashboardPessoal(3L);

        assertEquals(4L, dashboard.medicamentosAtivos());
        assertEquals(2L, dashboard.proximasDoses());
    }

    private DadosMedicamento dadosMedicamento(boolean ignorarDuplicidade) {
        return dadosMedicamento(ignorarDuplicidade, null, null, "LOSARTANA POTASSICA");
    }

    private DadosMedicamento dadosMedicamento(
            boolean ignorarDuplicidade,
            Long dependenteId,
            Long frequenciaId,
            String principioAtivo
    ) {
        return new DadosMedicamento(
                "LOSARTANA POTASSICA",
                principioAtivo,
                "50mg",
                "",
                null,
                3L,
                dependenteId,
                new DadosFrequenciaUso(
                        frequenciaId,
                        FrequenciaUsoTipo.HORARIOS_ESPECIFICOS,
                        true,
                        List.of(LocalTime.of(20, 0)),
                        0,
                        null,
                        null,
                        null
                ),
                new DadosEstoque(30, 4),
                ignorarDuplicidade
        );
    }

    private Medicamento medicamentoExistente(Long id, String principioAtivo) {
        Medicamento medicamento = new Medicamento();
        medicamento.setId(id);
        medicamento.setNome(principioAtivo);
        medicamento.setPrincipioAtivo(principioAtivo);
        medicamento.setDosagem("50mg");
        return medicamento;
    }

    private Usuario usuario(Long id) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNome("Usuario");
        usuario.setNomeUsuario("usuario");
        usuario.setTipoConta(CategoriaUsuario.PESSOAL);
        return usuario;
    }

    private Dependente dependente(Long id) {
        Dependente dependente = new Dependente();
        dependente.setId(id);
        dependente.setNome("Dependente");
        dependente.setNomeUsuario("dependente");
        return dependente;
    }

    private FrequenciaUso frequenciaContinua() {
        FrequenciaUso frequenciaUso = new FrequenciaUso();
        frequenciaUso.setFrequenciaUsoTipo(FrequenciaUsoTipo.HORARIOS_ESPECIFICOS);
        frequenciaUso.setUsoContinuo(true);
        frequenciaUso.setHorariosEspecificos(List.of(LocalTime.of(8, 0)));
        return frequenciaUso;
    }

    private FrequenciaUso frequenciaComPeriodo(LocalDate dataInicio, LocalDate dataTermino) {
        FrequenciaUso frequenciaUso = new FrequenciaUso();
        frequenciaUso.setFrequenciaUsoTipo(FrequenciaUsoTipo.HORARIOS_ESPECIFICOS);
        frequenciaUso.setUsoContinuo(false);
        frequenciaUso.setDataInicio(dataInicio);
        frequenciaUso.setDataTermino(dataTermino);
        frequenciaUso.setHorariosEspecificos(List.of(LocalTime.of(8, 0)));
        return frequenciaUso;
    }
}
