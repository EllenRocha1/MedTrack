import { BACKEND_URL } from "./api";

export const login = async (username, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorText = await response.json();
            throw new Error(errorText || "Usuário ou senha inválidos.");
        }

        const data = await response.json();
        localStorage.setItem('token', data.token); // Armazenando o token no localStorage
        return data; // Retornando os dados da resposta (se necessário)
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error; // Lançando o erro para ser tratado no componente
    }
};