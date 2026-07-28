package com.medtrack.medtrack;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class MedtrackApplicationTests {

	@Test
	void deveInstanciarAplicacaoSemSubirContextoSpring() {
		assertDoesNotThrow(MedtrackApplication::new);
	}

}
