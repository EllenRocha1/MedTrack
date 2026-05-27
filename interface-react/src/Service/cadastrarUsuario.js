import { BACKEND_URL } from "./api";

const parseErrorResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        try {
            return await response.json();
        } catch {
            return response.statusText;
        }
    }

    const text = await response.text();
    return text || response.statusText;
};

export const cadastrarUsuario = async (dadosCadastro) => {
    console.log('Dados enviados para a API:', dadosCadastro);

    try {
        const response = await fetch(`${BACKEND_URL}/usuarios/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCadastro)
        });

        if (response.status === 201) {
            console.log('Cadastro bem-sucedido!');
            return { success: true };
        }

        const errorData = await parseErrorResponse(response);
        console.error('Erro ao cadastrar usuário:', response.status, errorData);

        if (response.status === 400 && Array.isArray(errorData)) {
            return { success: false, errors: errorData };
        }

        return {
            success: false,
            message: typeof errorData === 'string' ? errorData : errorData?.message || 'Erro ao cadastrar usuário.'
        };
    } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        return { success: false, message: 'Erro ao conectar com a API. Verifique sua conexão e tente novamente.' };
    }
};