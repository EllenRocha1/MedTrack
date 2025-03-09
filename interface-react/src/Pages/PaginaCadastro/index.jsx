import { useState } from 'react';
import { cadastrarUsuario } from '../../Serviços/fectchCadastro';
import FormularioCadastro from '../../Componentes/FormularioCadastro';

const PaginaCadastro = ({ h1, p }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    data: ""
});

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const camposCadastro = [
    { type: "text",
      id: "nome-completo",
      label: "Nome: ",
      name: "nome",
      placeholder: "Digite seu nome"},//, value: nome, onChange: (e) => setNome(e.target.value) },
    { type: "email",
      id: "email",
      label: "E-mail: ",
      name: "email",
      placeholder: "Digite seu E-mail"},// value: email, onChange: (e) => setEmail(e.target.value) },
    { type: "date",
      id: "data",
      label: "Data de Nascimento: ",
      name: "data",
      placeholder: "Digite sua idade"}, //value: data, onChange: (e) => setData(e.target.value) }
  ]

  const getDados = (camposCadastros) => {
    return camposCadastros
  }

  const botaos = [
    { label: "Next", destino: "/cadastro_user"}
  ]

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioData = {
      nome: formData.nome,
      email: formData.email,
      dataNascimento: formData.data,
    };

    try {
      const data = await cadastrarUsuario(usuarioData);
      alert('Cadastro realizado com sucesso!');
      // Você pode redirecionar ou realizar outra ação após o cadastro
    } catch (err) {
      alert('Erro ao cadastrar usuário!');
    }
  };
  return (
    <div className=" h-screen flex justify-center items-center w-full text-center">
        <FormularioCadastro 
          h1={"Bem-Vindo ao MedTrack"} 
          p={"Cadastre-se e começe a gerenciar suas medicações."} 
          campos={camposCadastro} 
          botaos={botaos} 
          login={true}
          formData={formData} 
          handleChange={handleChange}
          />
      </div>
  );
};

export default PaginaCadastro;
