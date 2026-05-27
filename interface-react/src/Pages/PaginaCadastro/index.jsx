import React, { useState } from 'react';
import FormularioCadastro from '../../Componentes/FormularioCadastro';
import { useNavigate } from 'react-router-dom';

const PaginaCadastro = ({ h1, p }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    numeroTelefone: "",
    dataNascimento: ""
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const telefoneRegex = /^(?:(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{3}[-\s]?\d{4}|\d{4}[-\s]?\d{4})|(?:\+?[1-9]\d{0,2}\s?)?(?:\(?\d{1,4}\)?\s?)?(?:\d{4,5}[-\s]?\d{4}))$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setGlobalError('');
  };

  const camposCadastro = [
    { type: "text", id: "nome-completo", label: "Nome: ", name: "nome", placeholder: "Digite seu nome" },
    { type: "email", id: "email", label: "E-mail: ", name: "email", placeholder: "Digite seu E-mail" },
    { type: "text", id: "numeroTelefone", label: "Número de Celular: ", name: "numeroTelefone", placeholder: "Digite seu Celular: " },
    { type: "date", id: "dataNascimento", label: "Data de Nascimento: ", name: "dataNascimento", placeholder: "Digite sua idade" }
  ];

  const botaos = [
    { label: "Next", type: "submit" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.nome || !formData.email || !formData.numeroTelefone || !formData.dataNascimento) {
      setGlobalError('Por favor, preencha todos os campos.');
      return;
    }

    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'E-mail inválido. Informe um endereço de e-mail válido.';
    }

    if (!telefoneRegex.test(formData.numeroTelefone.trim())) {
      newErrors.numeroTelefone = 'Número de telefone inválido. Use formato BR ou internacional válido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGlobalError('Corrija os campos destacados antes de avançar.');
      return;
    }

    navigate('/cadastro_user', { state: formData });
    console.log('1° Formulário submetido!');
    console.log('Dados da primeira tela_1:', formData);
  };

  return (
      <div className="h-screen flex justify-center items-center w-full text-center">
        <FormularioCadastro
            h1={"Bem-Vindo ao MedTrack"}
            p={"Cadastre-se e começe a gerenciar suas medicações."}
            campos={camposCadastro}
            botaos={botaos}
            login={true}
            formData={formData}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            globalError={globalError}
        />
      </div>
  );
};

export default PaginaCadastro;