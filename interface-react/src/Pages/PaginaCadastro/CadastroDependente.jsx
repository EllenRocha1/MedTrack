import { useState } from 'react';
import FormularioCadastro from '../../Componentes/FormularioCadastro';
import api, { BACKEND_URL } from "../../Service/api";
import { useNavigate } from "react-router-dom";

const CadastroDependente = () => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    nomeUsuario: "",
    senha: ""
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: undefined });
    setGlobalError('');
  };

  const handleSubmit = async (e) => {
    console.log('Formulário do Dependente submetido ');
    e.preventDefault();

    setErrors({});
    setGlobalError('');

    console.log('Dados do formulário:', formData);

    if (!formData.nome || !formData.telefone || !formData.email || !formData.nomeUsuario || !formData.senha) {
      setGlobalError('Por favor, preencha todos os campos.');
      return;
    }

    const dadosCadastro = {
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      nomeUsuario: formData.nomeUsuario,
      senha: formData.senha
    };

    try {
      const sucesso = await api.post(`${BACKEND_URL}/dependentes/cadastrar`, dadosCadastro);
      console.log("Dependente cadastrado com sucesso!");
      console.log(sucesso)
      if (sucesso) {
        navigate('/lista_dependentes');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      if (error.details && Array.isArray(error.details)) {
        setErrors(Object.fromEntries(error.details.map((item) => [item.campo, item.mensagem])));
        setGlobalError(error.details.map((item) => item.mensagem).join(' '));
      } else {
        setGlobalError(error.message || 'Erro ao cadastrar usuário. Verifique sua conexão ou tente novamente mais tarde.');
      }
    }
  };
  const camposCadastro = [
    { type: "text", id: "nome-completo", label: "Nome", name: "nome", placeholder: "Digite o nome do dependente" },
    { type: "text", id: "telefone", label: "Número", name: "telefone", placeholder: "Digite o número do dependente" },
    { type: "text", id: "email", label: "Email", name: "email", placeholder: "Digite o email do dependente" },
    { type: "text", id: "nomeUsuario", label: "Nome de Usuário:", name: "nomeUsuario", placeholder: "Digite o nome de Usuário"},
    { type: "password", id: "password", label: "Senha: ", name: "senha", placeholder: "Digite sua senha"}
  ];

  const botaos = [{ label: "Criar", type: "submit" }];

  return (
      <div className="h-screen flex justify-center items-center w-full text-center">
        <FormularioCadastro
            h1="Novo Dependente"
            campos={camposCadastro}
            botaos={botaos}
            formData={formData}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            globalError={globalError}
        />
      </div>
  );
};

export default CadastroDependente;