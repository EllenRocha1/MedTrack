package com.medtrack.medtrack.service;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CloudinaryServiceTest {

    private final CloudinaryService cloudinaryService = new CloudinaryService();

    @Test
    void deveIgnorarUploadQuandoArquivoForNuloOuVazio() {
        assertNull(cloudinaryService.uploadImagem(null));

        var vazio = new MockMultipartFile("imagem", "foto.jpg", "image/jpeg", new byte[0]);

        assertNull(cloudinaryService.uploadImagem(vazio));
    }

    @Test
    void deveRejeitarArquivoComContentTypeInvalido() {
        var texto = new MockMultipartFile("imagem", "arquivo.txt", "text/plain", "conteudo".getBytes());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> cloudinaryService.uploadImagem(texto)
        );

        assertEquals("Tipo de arquivo invalido. Envie uma imagem JPEG ou PNG.", exception.getMessage());
    }

    @Test
    void deveFalharComImagemValidaQuandoCloudinaryNaoEstaConfigurado() {
        var imagem = new MockMultipartFile("imagem", "foto.png", "image/png", new byte[]{1, 2, 3});

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> cloudinaryService.uploadImagemMedicamento(imagem)
        );

        assertEquals("Cloudinary nao configurado. Verifique as variaveis de ambiente.", exception.getMessage());
    }
}
