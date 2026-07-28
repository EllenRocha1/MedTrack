CREATE TABLE IF NOT EXISTS Estoque (
    id BIGSERIAL PRIMARY KEY,
    quantidade_atual INT DEFAULT 0,
    quantidade_minima INT,
    medicamento_id BIGINT UNIQUE NOT NULL,
    CONSTRAINT fk_estoque_medicamento FOREIGN KEY (medicamento_id) REFERENCES Medicamentos(id) ON DELETE CASCADE
);