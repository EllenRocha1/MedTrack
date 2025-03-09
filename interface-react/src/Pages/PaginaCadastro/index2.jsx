// src/pages/PaginaCadastro2.js

import React, { useState } from 'react';
import FormularioCadastro from '../../Componentes/FormularioCadastro';
import { cadastrarUsuario2 } from '../../Serviços/fectchCadastro'; // Importando o serviço

const PaginaCadastro2 = ({ h1, p }) => {
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');
    const [tipoConta, setTipoConta] = useState('');

    const camposCadastro = [
        {
            type: 'text',
            id: 'nome-usuario',
            label: 'Nome de Usuário: ',
            name: 'user',
            placeholder: 'Digite seu nome de usuário',
            value: nomeUsuario,
            onChange: (e) => setNomeUsuario(e.target.value),
        },
        {
            type: 'password',
            id: 'senha',
            label: 'Senha: ',
            name: 'senha',
            placeholder: 'Digite sua senha',
            value: senha,
            onChange: (e) => setSenha(e.target.value),
        },
        {
            type: 'password',
            id: 'confSenha',
            label: 'Confirme sua senha: ',
            name: 'confSenha',
            placeholder: 'Confirme sua senha',
            value: confSenha,
            onChange: (e) => setConfSenha(e.target.value),
        },
        {
            type: 'select',
            id: 'tipo-conta',
            label: 'Tipo de Conta:',
            name: 'tipoConta',
            value: tipoConta,
            options: [
                { value: '', text: 'Selecione...' },
                { value: 'administrador', text: 'Administrador' },
                { value: 'pessoal', text: 'Pessoal' },
            ],
            onChange: (e) => setTipoConta(e.target.value),
        },
    ];

    const botaos = [
        { label: 'Voltar', destino: '/cadastro' },
        { label: 'Finalizar', destino: '/cadastro_concluido' },
    ];

    // Função de submissão para o botão "Finalizar"
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação de senhas
        if (senha !== confSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        const usuarioData = {
            nomeUsuario: nomeUsuario,
            senha: senha,
            tipoConta: tipoConta,
        };

        try {
            // Envia os dados via fetch para o backend
            const data = await cadastrarUsuario2(usuarioData);
            alert('Cadastro de usuário realizado com sucesso!');

            // Redirecionar ou executar alguma outra ação após o sucesso
            // Aqui você pode redirecionar para outra página se necessário:
            // window.location.href = '/cadastro_concluido';
        } catch (err) {
            alert('Erro ao cadastrar usuário!');
        }
    };

    return (
        <div className="h-screen flex justify-center items-center w-full text-center">
            <FormularioCadastro
                h1={'Quase-lá'}
                p={'Agora cadastre seu usuário'}
                campos={camposCadastro}
                botaos={botaos}
                login={true}
                handleSubmit={handleSubmit} // Passando a função handleSubmit
            />
        </div>
    );
};

export default PaginaCadastro2;
