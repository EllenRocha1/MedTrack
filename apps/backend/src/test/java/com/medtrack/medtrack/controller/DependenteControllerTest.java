package com.medtrack.medtrack.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependentePut;
import com.medtrack.medtrack.service.DependenteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DependenteControllerTest {

    private DependenteService dependenteService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        dependenteService = mock(DependenteService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new DependenteController(dependenteService)).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void deveCadastrarDependente() throws Exception {
        Dependente dependente = dependente();
        when(dependenteService.cadastrar(any(), eq("Bearer jwt"))).thenReturn(dependente);

        mockMvc.perform(post("/dependentes/cadastrar")
                        .header("Authorization", "Bearer jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dadosDependente())))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/dependentes/cadastrar/5"));
    }

    @Test
    void deveListarDetalharAtualizarEDeletarDependentes() throws Exception {
        Dependente dependente = dependente();

        when(dependenteService.listarPorToken("Bearer jwt")).thenReturn(List.of(dependente));
        when(dependenteService.listarPorAdministradorId(1L)).thenReturn(List.of(dependente));
        when(dependenteService.buscarPorId(5L)).thenReturn(Optional.of(dependente));
        when(dependenteService.atualizar(any())).thenReturn(dependente);
        when(dependenteService.existePorId(5L)).thenReturn(true);

        mockMvc.perform(get("/dependentes/buscar/todos").header("Authorization", "Bearer jwt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome", is("Dependente")));

        mockMvc.perform(get("/dependentes/administrador/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nomeUsuario", is("dependente")));

        mockMvc.perform(get("/dependentes/buscar/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("dependente@email.com")));

        mockMvc.perform(put("/dependentes/atualizar/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dadosDependentePut())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeUsuario", is("dependente")));

        mockMvc.perform(delete("/dependentes/deletar/5"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deveRetornarNoContentQuandoNaoHaDependentesOuDetalhe() throws Exception {
        when(dependenteService.listarPorAdministradorId(1L)).thenReturn(List.of());
        when(dependenteService.buscarPorId(5L)).thenReturn(Optional.empty());
        when(dependenteService.existePorId(5L)).thenReturn(false);

        mockMvc.perform(get("/dependentes/administrador/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/dependentes/buscar/5"))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/dependentes/deletar/5"))
                .andExpect(status().isNotFound());
    }

    private DadosDependente dadosDependente() {
        return new DadosDependente(
                "Dependente",
                "dependente@email.com",
                "+5581999999999",
                1L,
                "dependente",
                "senha"
        );
    }

    private DadosDependentePut dadosDependentePut() {
        return new DadosDependentePut(
                5L,
                "Dependente",
                "+5581999999999",
                "dependente@email.com",
                "dependente",
                "hash"
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
