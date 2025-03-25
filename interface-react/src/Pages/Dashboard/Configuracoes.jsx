import { useState } from "react";
import Sidebar from "../../Componentes/Sidebar";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";

const Configuracoes = () => {
  const [abaAtiva, setAbaAtiva] = useState("perfil");
    const role = getUserRole()
    let type = true
    if (role === "PESSOAL") {
        type = false;
    }

   return(
        <div className="flex h-screen bg-gray-100">
        
        <Sidebar type={type} usuarioId={getUserInfo().id} />
        <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Configurações do Administrador</h1>
      <div className="flex gap-4 border-b pb-2 mb-4">
        {[
          { id: "perfil", nome: "Editar Perfil" },
          { id: "dependentes", nome: "Dependentes" }
        
        ].map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`px-4 py-2 text-lg font-medium border-b-2 transition-colors ${
              abaAtiva === aba.id ? "border-cyan-500 text-cyan-500" : "border-transparent hover:text-gray-600"
            }`}
          >
            {aba.nome}
          </button>
        ))}
      </div>
      <div className="border rounded-lg p-4 bg-white shadow-md">
        {abaAtiva === "perfil" && <Perfil />}
        {abaAtiva === "dependentes" && <Dependentes />}
      </div>
    </div>
    </div>
  );
};

const Perfil = () => (
  <div>
    <h2 className="text-xl font-semibold">Perfil do Administrador</h2>
    <p className="text-gray-600 mb-2">Atualize suas informações.</p>
    <input className="border p-2 w-full mb-2" type="text" placeholder="Nome" />
    <input className="border p-2 w-full mb-2" type="email" placeholder="E-mail" />
    <input className="border p-2 w-full mb-2" type="password" placeholder="Nova senha" />
    <button className="bg-cyan-500 text-white px-4 py-2 rounded mt-2">Salvar</button>
  </div>
);

const Dependentes = () => (
  <div>
    <h2 className="text-xl font-semibold">Gerenciar Dependentes</h2>
    <p className="text-gray-600 mb-2">Adicione ou edite dependentes.</p>
    <input className="border p-2 w-full mb-2" type="text" placeholder="Nome do dependente" />
    <input className="border p-2 w-full mb-2" type="date" placeholder="Data de nascimento" />
    <button className="bg-cyan-500 text-white px-4 py-2 rounded mt-2">Adicionar</button>
    <button className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2">Remover</button>
  </div>
);



export default Configuracoes;

