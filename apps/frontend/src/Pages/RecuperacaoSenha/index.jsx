import { useState } from 'react';
import FormularioCadastro from '../../Componentes/FormularioCadastro';
import FormularioLogin from '../../Componentes/FormularioLogin'
import fundoVerde from '../../Imagens/fundo_verde.jpeg';

const RecuperacaoSenha = () => {
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [email, setEmail] = useState("");
    
    const camposCadastro = [
    { type: "text", id: "nome-usuario", label: "Nome de Usuário: ", name: "user", placeholder: "Digite seu nome de usuário", value: nomeUsuario, onChange: (e) => setNomeUsuario(e.target.value) },
    { type: "email", id: "email", label: "Email: ", name: "email", placeholder: "Digite seu email", value: email, onChange: (e) => setEmail(e.target.value) },
    ]

    const botaos = [
      { label: "Enviar"}
    ]

    return(
        <div className=" h-screen flex justify-center items-center w-full text-center">
          <FormularioCadastro h1={"Recupere sua senha"}  campos={camposCadastro} botaos={botaos} login={true}/>
        </div>
     
    )
}

export default RecuperacaoSenha