package com.medtrack.medtrack.model;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.dependente.DependenteDetails;
import com.medtrack.medtrack.model.dependente.dto.DadosDependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependentePut;
import com.medtrack.medtrack.model.medicamento.FrequenciaUsoTipo;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosEstoque;
import com.medtrack.medtrack.model.medicamento.dto.DadosFrequenciaPut;
import com.medtrack.medtrack.model.medicamento.dto.DadosFrequenciaUso;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.UsuarioDetails;
import com.medtrack.medtrack.model.usuario.dto.DadosLoginResponse;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ModelDtoTest {

    @Test
    void deveConstruirConfirmacaoSemImagem() {
        DadosConfirmacao dados = new DadosConfirmacao(
                1L,
                2L,
                LocalTime.of(9, 0),
                LocalDate.of(2026, 5, 30),
                true,
                "observacao"
        );
        Usuario usuario = new Usuario();
        Medicamento medicamento = new Medicamento();

        Confirmacao confirmacao = new Confirmacao(dados, usuario, medicamento);

        assertSame(usuario, confirmacao.getUsuario());
        assertSame(medicamento, confirmacao.getMedicamento());
        assertEquals(LocalTime.of(9, 0), confirmacao.getHorario());
        assertEquals("observacao", confirmacao.getObservacao());
    }

    @Test
    void deveConstruirMedicamentoParaUsuarioDependenteEAmbos() {
        DadosMedicamento dados = dadosMedicamento();
        Usuario usuario = new Usuario();
        Dependente dependente = new Dependente();

        Medicamento porUsuario = new Medicamento(dados, usuario);
        Medicamento porDependente = new Medicamento(dados, dependente);
        Medicamento porAmbos = new Medicamento(dados, usuario, dependente);

        assertSame(usuario, porUsuario.getUsuario());
        assertSame(dependente, porDependente.getDependente());
        assertSame(usuario, porAmbos.getUsuario());
        assertSame(dependente, porAmbos.getDependente());
        assertEquals(30, porUsuario.getEstoque().getQuantidadeAtual());
    }

    @Test
    void deveAtualizarMedicamentoIgnorandoCamposNulos() {
        Medicamento medicamento = new Medicamento(dadosMedicamento(), new Usuario());
        DadosMedicamentoPut dados = new DadosMedicamentoPut(
                1L,
                "Novo nome",
                null,
                "750mg",
                null,
                null,
                null,
                null
        );

        medicamento.atualizarInformacoes(dados, medicamento);

        assertEquals("Novo nome", medicamento.getNome());
        assertEquals("LOSARTANA POTASSICA", medicamento.getPrincipioAtivo());
        assertEquals("750mg", medicamento.getDosagem());
    }

    @Test
    void deveExporDadosDeUsuarioEDependenteDetails() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Maria");
        usuario.setNomeUsuario("maria");
        usuario.setEmail("maria@example.com");
        usuario.setSenhaHashed("hash");
        usuario.setTipoConta(CategoriaUsuario.PESSOAL);

        UsuarioDetails usuarioDetails = new UsuarioDetails(usuario);

        assertEquals("maria", usuarioDetails.getUsername());
        assertEquals("hash", usuarioDetails.getPassword());
        assertEquals("Maria", usuarioDetails.getNome());
        assertTrue(usuarioDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("PESSOAL")));

        Dependente dependente = new Dependente();
        dependente.setId(5L);
        dependente.setNome("Dependente");
        dependente.setNomeUsuario("dep");
        dependente.setEmail("dep@example.com");
        dependente.setTelefone("81999999999");
        dependente.setSenhaHashed("hash-dep");

        DependenteDetails dependenteDetails = new DependenteDetails(dependente);

        assertSame(dependente, dependenteDetails.getDependente());
        assertEquals("dep", dependenteDetails.getUsername());
        assertEquals("hash-dep", dependenteDetails.getPassword());
        assertEquals("Dependente", dependenteDetails.getNome());
        assertEquals("dep@example.com", dependenteDetails.getEmail());
        assertEquals("81999999999", dependenteDetails.getTelefone());
        assertEquals(5L, dependenteDetails.getIdDependente());
        assertTrue(dependenteDetails.getAuthorities().isEmpty());
    }

    @Test
    void deveNormalizarDependentePutECriarDtosSimples() {
        DadosDependentePut dependentePut = new DadosDependentePut(
                5L,
                " Dependente ",
                "(81) 99999-9999",
                " DEPENDENTE@EMAIL.COM ",
                " dep ",
                " hash "
        );
        DadosFrequenciaPut frequenciaPut = new DadosFrequenciaPut(
                FrequenciaUsoTipo.INTERVALO_ENTRE_DOSES,
                List.of(),
                8,
                LocalTime.of(8, 0),
                LocalDate.now(),
                LocalDate.now().plusDays(1)
        );
        DadosLoginResponse loginResponse = new DadosLoginResponse("jwt");

        assertEquals("Dependente", dependentePut.nome());
        assertEquals("81999999999", dependentePut.telefone());
        assertEquals("dependente@email.com", dependentePut.email());
        assertEquals("dep", dependentePut.nomeUsuario());
        assertEquals("hash", dependentePut.senhaHashed());
        assertEquals(8, frequenciaPut.intervaloHoras());
        assertEquals("jwt", loginResponse.token());
    }

    private DadosMedicamento dadosMedicamento() {
        return new DadosMedicamento(
                "Losartana",
                "LOSARTANA POTASSICA",
                "50mg",
                "Antes de dormir",
                "https://cdn/foto.jpg",
                1L,
                null,
                new DadosFrequenciaUso(
                        null,
                        FrequenciaUsoTipo.HORARIOS_ESPECIFICOS,
                        true,
                        List.of(LocalTime.of(20, 0)),
                        0,
                        null,
                        null,
                        null
                ),
                new DadosEstoque(30, 4),
                false
        );
    }
}
