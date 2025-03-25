import { useState } from "react";
import { Phone, Trash, UserCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../Service/api";

const CardDependente = ({ termoPesquisa, dependentes, removerDependente, onClickDependente }) => {
    const navigate = useNavigate();

    const dependentesFiltrados = dependentes.filter(dep =>
        dep.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
    );

    function remover() {
        api.delete()
    }

    return (
        <div className="p-6">
            <div className="flex flex-wrap max-h-[500px] gap-5 justify-center overflow-y-auto p-2 border border-cyan-200 rounded-lg">
                {dependentesFiltrados.map((dep) => (
                    <div key={dep.id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 flex flex-col items-center w-64">
                        <h3 className="text-xl font-semibold">{dep.nome}</h3>
                        <div className="flex items-center gap-2 text-gray-700 mt-2">
                            <Phone size={16} className="text-cyan-500" />
                            <span>{dep.telefone}</span>
                        </div>
                        <div className="flex gap-5">
                            <button 
                                onClick={(e) =>{
                                    e.stopPropagation();
                                    removerDependente(dep.id)}
                                    }
                                className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                <Trash size={16} />
                            </button>
                            <button
                                className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => onClickDependente(dep.id) }
                            >
                                <UserCircleIcon size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardDependente;