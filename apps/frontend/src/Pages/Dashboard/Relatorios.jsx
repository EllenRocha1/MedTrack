import { useState } from "react";
import Header from "../../Componentes/Header/index.jsx";
import Sidebar from "../../Componentes/Sidebar/index.jsx";
import Relatorio from "../../Componentes/Relatorio/index.jsx";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";

const Relatorios = () => {
    const [termoPesquisa, setTermoPesquisa] = useState(""); // Define the state and setter
    const role = getUserRole()
    let type = true
    if (role === "PESSOAL") {
        type = false;
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <Sidebar className="w-64" type={type} usuarioId={getUserInfo().id} />
                <div className="flex-1 p-4 transition-all duration-300">
                    {/* Pass setTermoPesquisa to Header */}
                    <Header h1={"MedTrack"} exibirPesquisa={true} setTermoPesquisa={setTermoPesquisa} />
                    <div className="flex self-center justify-between mt-10 ml-10 mr-10">
                        <h1 className="text-2xl font-bold mt-2">Relatório dos Dependentes</h1>
                    </div>
                    {/* Pass termoPesquisa to Relatorio */}
                    <Relatorio termoPesquisa={termoPesquisa} />
                </div>
            </div>
        </div>
    );
};

export default Relatorios;