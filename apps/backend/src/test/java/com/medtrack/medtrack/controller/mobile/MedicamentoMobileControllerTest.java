package com.medtrack.medtrack.controller.mobile;

import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoMobile;
import com.medtrack.medtrack.service.JwtService;
import com.medtrack.medtrack.service.MedicamentoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicamentoMobileControllerTest {

    @Mock
    private MedicamentoService medicamentoService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private MedicamentoMobileController medicamentoMobileController;

    @Test
    void deveListarMedicamentosMobileAPartirDoToken() {
        var medicamentos = List.of(new DadosMedicamentoMobile(
                6L,
                "Losartana",
                "Losartana Potassica",
                "50mg",
                "https://cdn/foto.jpg",
                null
        ));

        when(jwtService.extractUsername("jwt")).thenReturn("mobile");
        when(medicamentoService.listarMedicamentosMobilePorUsuario("mobile")).thenReturn(medicamentos);

        var response = medicamentoMobileController.getMedicamentos("Bearer jwt");

        assertEquals(200, response.getStatusCode().value());
        assertSame(medicamentos, response.getBody());
    }
}
