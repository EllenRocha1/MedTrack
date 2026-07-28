package com.medtrack.medtrack.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private static final String PASTA_CONFIRMACOES = "medtrack/confirmacoes";
    private static final String PASTA_MEDICAMENTOS = "medtrack/medicamentos";

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        String cloudName = System.getenv("CLOUDINARY_CLOUD_NAME");
        String apiKey = System.getenv("CLOUDINARY_API_KEY");
        String apiSecret = System.getenv("CLOUDINARY_API_SECRET");

        if (isBlank(cloudName) || isBlank(apiKey) || isBlank(apiSecret)) {
            this.cloudinary = null;
            return;
        }

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    public String uploadImagem(MultipartFile arquivo) {
        return uploadImagem(arquivo, PASTA_CONFIRMACOES);
    }

    public String uploadImagemMedicamento(MultipartFile arquivo) {
        return uploadImagem(arquivo, PASTA_MEDICAMENTOS);
    }

    private String uploadImagem(MultipartFile arquivo, String pasta) {
        if (arquivo == null || arquivo.isEmpty()) {
            return null;
        }

        validarTipoImagem(arquivo);

        if (cloudinary == null) {
            throw new RuntimeException("Cloudinary nao configurado. Verifique as variaveis de ambiente.");
        }

        try {
            Map<?, ?> resultado = cloudinary.uploader().upload(
                    arquivo.getBytes(),
                    ObjectUtils.asMap("folder", pasta)
            );

            Object secureUrl = resultado.get("secure_url");
            if (secureUrl == null) {
                throw new RuntimeException("Cloudinary nao retornou a URL segura da imagem.");
            }

            return secureUrl.toString();
        } catch (IOException | RuntimeException e) {
            throw new RuntimeException("Falha ao enviar imagem para o Cloudinary: " + e.getMessage(), e);
        }
    }

    private void validarTipoImagem(MultipartFile arquivo) {
        String contentType = arquivo.getContentType();
        if (!"image/jpeg".equals(contentType) && !"image/png".equals(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo invalido. Envie uma imagem JPEG ou PNG.");
        }
    }

    private boolean isBlank(String valor) {
        return valor == null || valor.isBlank();
    }
}
