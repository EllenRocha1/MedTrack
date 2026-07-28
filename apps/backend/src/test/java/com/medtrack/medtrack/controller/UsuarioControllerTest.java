package com.medtrack.medtrack.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.medtrack.medtrack.model.usuario.CategoriaUsuario;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioAtualizacao;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import com.medtrack.medtrack.model.usuario.dto.DetalhamentoUsuario;
import com.medtrack.medtrack.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

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

class UsuarioControllerTest {

    private UsuarioService usuarioService;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        usuarioService = mock(UsuarioService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new UsuarioController(usuarioService))
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveCadastrarUsuario() throws Exception {
        Usuario usuario = usuario();
        when(usuarioService.cadastrarUsuario(any())).thenReturn(usuario);

        mockMvc.perform(post("/usuarios/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dadosCadastro())))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/usuarios/cadastro/1"));
    }

    @Test
    void deveListarDetalharAtualizarEDeletarUsuarios() throws Exception {
        Usuario usuario = usuario();
        var detalhes = new DetalhamentoUsuario(usuario);

        when(usuarioService.listar(any())).thenReturn(new PageImpl<>(List.of(detalhes), PageRequest.of(0, 20), 1));
        when(usuarioService.detalhar(1L)).thenReturn(detalhes);
        when(usuarioService.atualizarUsuario(eq(1L), any())).thenReturn(usuario);

        mockMvc.perform(get("/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nome", is("Maria")));

        mockMvc.perform(get("/usuarios/buscar/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeUsuario", is("maria")));

        mockMvc.perform(put("/usuarios/atualizar/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dadosAtualizacao())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome", is("Maria")));

        mockMvc.perform(delete("/usuarios/deletar/1"))
                .andExpect(status().isNoContent());
    }

    private DadosUsuarioCadastro dadosCadastro() {
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

    private DadosUsuarioAtualizacao dadosAtualizacao() {
        return new DadosUsuarioAtualizacao(
                "Maria",
                "maria@example.com",
                "maria",
                "+5581999999999",
                "senha",
                CategoriaUsuario.PESSOAL,
                LocalDate.of(1990, 1, 1)
        );
    }

    private Usuario usuario() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Maria");
        usuario.setEmail("maria@example.com");
        usuario.setNomeUsuario("maria");
        usuario.setNumeroTelefone("81999999999");
        usuario.setDataNascimento(LocalDate.of(1990, 1, 1));
        usuario.setTipoConta(CategoriaUsuario.PESSOAL);
        return usuario;
    }
}
