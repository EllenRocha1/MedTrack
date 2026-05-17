import { BACKEND_URL } from "./api";

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
            return true;
        } else {
            console.error('Erro ao cadastrar usuário:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        return false;
    }
};