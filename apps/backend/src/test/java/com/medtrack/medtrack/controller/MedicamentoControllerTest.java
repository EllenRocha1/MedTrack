package com.medtrack.medtrack.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.medtrack.medtrack.model.medicamento.FrequenciaUsoTipo;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosDuplicidadeMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosEstoque;
import com.medtrack.medtrack.model.medicamento.dto.DadosEstoqueGet;
import com.medtrack.medtrack.model.medicamento.dto.DadosEstoquePut;
import com.medtrack.medtrack.model.medicamento.dto.DadosFrequenciaUso;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoGet;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.model.usuario.dto.DadosDashboardPessoal;
import com.medtrack.medtrack.service.CloudinaryService;
import com.medtrack.medtrack.service.MedicamentoService;
import com.medtrack.medtrack.util.exception.DuplicidadeMedicamentoException;
import com.medtrack.medtrack.util.exception.TratadorDeErros;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalTime;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MedicamentoControllerTest {

    private MedicamentoService medicamentoService;
    private CloudinaryService cloudinaryService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        medicamentoService = mock(MedicamentoService.class);
        cloudinaryService = mock(CloudinaryService.class);
        MedicamentoController controller = new MedicamentoController(medicamentoService, cloudinaryService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new TratadorDeErros())
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveRetornarConflictQuandoPrincipioAtivoForDuplicado() throws Exception {
        Medicamento existente = new Medicamento();
        existente.setId(6L);
        existente.setNome("Losartana");
        existente.setPrincipioAtivo("Losartana Potássica");

        when(medicamentoService.criarMedicamento(any()))
                .thenThrow(new DuplicidadeMedicamentoException(new DadosDuplicidadeMedicamento(existente)));

        mockMvc.perform(post("/medicamentos/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dadosMedicamento(false))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.duplicidade", is(true)))
                .andExpect(jsonPath("$.medicamentoExistenteId", is(6)))
                .andExpect(jsonPath("$.principioAtivoConflitante", is("Losartana Potássica")))
                .andExpect(jsonPath("$.nomeMedicamentoExistente", is("Losartana")));
    }

    @Test
    void deveRetornarCreatedQuandoCadastroForValido() throws Exception {
        Medicamento medicamento = new Medicamento();
        medicamento.setId(12L);
        medicamento.setNome("Dipirona");
        medicamento.setPrincipioAtivo("Dipirona");
        medicamento.setDosagem("500mg");

        when(medicamentoService.criarMedicamento(any())).thenReturn(medicamento);

        mockMvc.perform(post("/medicamentos/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dadosMedicamento(false))))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/medicamentos/cadastro/12"))
                .andExpect(jsonPath("$.id", is(12)))
                .andExpect(jsonPath("$.nome", is("Dipirona")));
    }

    @Test
    void deveListarDetalharEFiltrarMedicamentos() throws Exception {
        DadosMedicamentoGet medicamento = new DadosMedicamentoGet(medicamento(12L, "Dipirona"));
        DadosDashboardPessoal dashboard = new DadosDashboardPessoal(1, 0, 1, List.of(medicamento), List.of());

        when(medicamentoService.listarPorUsuario(3L)).thenReturn(List.of(medicamento));
        when(medicamentoService.listarPorDependente(4L)).thenReturn(List.of(medicamento));
        when(medicamentoService.listarEstoqueCriticoDto(3L)).thenReturn(List.of(medicamento));
        when(medicamentoService.detalhar(12L)).thenReturn(medicamento);
        when(medicamentoService.obterDadosDashboardPessoal(3L)).thenReturn(dashboard);

        mockMvc.perform(get("/medicamentos/todos/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(12)));

        mockMvc.perform(get("/medicamentos/todos/dependente/4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome", is("Dipirona")));

        mockMvc.perform(get("/medicamentos/estoque-critico/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].principioAtivo", is("Dipirona")));

        mockMvc.perform(get("/medicamentos/buscar/12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(12)));

        mockMvc.perform(get("/medicamentos/dashboard/resumo/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.medicamentosAtivos", is(1)));
    }

    @Test
    void deveConsumirReporAtualizarImagemEDeletarMedicamento() throws Exception {
        Medicamento medicamento = medicamento(12L, "Dipirona");
        when(medicamentoService.consumirDose(12L)).thenReturn(new DadosEstoqueGet(1L, 9, 2, false));
        when(medicamentoService.reporEstoque(12L, 5)).thenReturn(new DadosEstoqueGet(1L, 14, 2, false));
        when(cloudinaryService.uploadImagemMedicamento(any())).thenReturn("https://cdn/nova.jpg");
        when(medicamentoService.atualizarImagem(eq(12L), eq("https://cdn/nova.jpg"))).thenReturn(medicamento);

        mockMvc.perform(patch("/medicamentos/12/consumir"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantidadeAtual", is(9)));

        mockMvc.perform(patch("/medicamentos/12/repor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantidadeAtual", is(14)));

        mockMvc.perform(put("/medicamentos/alterar/12")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dadosMedicamentoPut())))
                .andExpect(status().isOk());

        MockMultipartFile imagem = new MockMultipartFile(
                "imagem",
                "foto.jpg",
                "image/jpeg",
                new byte[]{1, 2, 3}
        );

        mockMvc.perform(multipart("/medicamentos/12/imagem").file(imagem))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(12)));

        mockMvc.perform(delete("/medicamentos/deletar/12"))
                .andExpect(status().isNoContent());
    }

    private DadosMedicamento dadosMedicamento(boolean ignorarDuplicidade) {
        return new DadosMedicamento(
                "LOSARTANA POTASSICA",
                "LOSARTANA POTASSICA",
                "50mg",
                "",
                null,
                3L,
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
                ignorarDuplicidade
        );
    }

    private DadosMedicamentoPut dadosMedicamentoPut() {
        return new DadosMedicamentoPut(
                3L,
                "Dipirona gotas",
                "Dipirona",
                "500mg",
                null,
                null,
                new DadosEstoquePut(10, 2),
                null
        );
    }

    private Medicamento medicamento(Long id, String nome) {
        Medicamento medicamento = new Medicamento();
        medicamento.setId(id);
        medicamento.setNome(nome);
        medicamento.setPrincipioAtivo(nome);
        medicamento.setDosagem("500mg");
        return medicamento;
    }
}
