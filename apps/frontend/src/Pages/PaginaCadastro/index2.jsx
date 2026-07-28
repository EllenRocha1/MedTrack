import React, { useState } from 'react';
import FormularioCadastro from '../../Componentes/FormularioCadastro';
import { useLocation, useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../../Service/cadastrarUsuario';
import Loading from '../../Componentes/Loading';

const PaginaCadastro2 = ({ h1, p }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nomeUsuario: '',
        senha: '',
        confSenha: '',
        categoria: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: undefined });
        setGlobalError('');
    };

    const handleSubmit = async (e) => {
        console.log('2° Formulário submetido!');
        e.preventDefault();
        setLoading(true);

        console.log('Dados do formulário:', formData);

        if (!formData.nomeUsuario || !formData.senha || !formData.confSenha || !formData.categoria) {
            setGlobalError('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        if (formData.senha !== formData.confSenha) {
            setErrors({ senha: 'As senhas não coincidem!', confSenha: 'As senhas não coincidem!' });
            setGlobalError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (formData.categoria === '') {
            setErrors({ categoria: 'Por favor, selecione um tipo de conta.' });
            setGlobalError('Por favor, selecione um tipo de conta.');
            setLoading(false);
            return;
        }

        const dadosCadastro = {
            ...location.state, // Dados da primeira página
            nomeUsuario: formData.nomeUsuario,
            senha: formData.senha,
            categoria: formData.categoria
        };

        console.log('Dados enviados para a API:', dadosCadastro);

        try {
            const resposta = await cadastrarUsuario(dadosCadastro);

            if (resposta.success) {
                navigate('/cadastro_concluido');
                return;
            }

            if (resposta.errors) {
                setErrors(Object.fromEntries(resposta.errors.map((erro) => [erro.campo, erro.mensagem])));
                setGlobalError(
                    resposta.errors
                        .map((erro) => erro.mensagem)
                        .filter(Boolean)
                        .join(' ')
                        .trim() || 'Verifique os campos e tente novamente.'
                );
                return;
            }

            setGlobalError(resposta.message || 'Erro ao cadastrar usuário. Verifique sua conexão ou tente novamente mais tarde.');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            setGlobalError('Erro ao cadastrar usuário. Verifique sua conexão ou tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const camposCadastro = [
        { type: 'text', id: 'nome-usuario', label: 'Nome de Usuário: ', name: 'nomeUsuario', placeholder: 'Digite seu nome de usuário' },
        { type: 'password', id: 'senha', label: 'Senha: ', name: 'senha', placeholder: 'Digite sua senha' },
        { type: 'password', id: 'confSenha', label: 'Confirme sua senha: ', name: 'confSenha', placeholder: 'Confirme sua senha' },
        {
            type: 'select', id: 'tipo-conta', label: 'Tipo de Conta:', name: 'categoria', options: [

                { value: '', text: 'Selecione...' },
                { value: 'ADMINISTRADOR', text: 'Administrador' },
                { value: 'PESSOAL', text: 'Pessoal' }
            ]
        }
    ];

    const botaos = [
        { label: 'Voltar', destino: '/cadastro' },
        { label: 'Finalizar', type: "submit" }
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading message={"Criando sua conta..."} color={"purple"} icon={"user-plus"} />
            </div>
        );
    }

    return (
        <div className="h-screen flex justify-center items-center w-full text-center">
            <FormularioCadastro
                h1={'Quase-lá'}
                p={'precisamos de mais algumas informações'}
                campos={camposCadastro}
                botaos={botaos}
                login={true}
                onSubmit={handleSubmit}
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                globalError={globalError}
            />
        </div>
    );
};

export default PaginaCadastro2;