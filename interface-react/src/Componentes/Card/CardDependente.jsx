import { useState } from "react";
import { Phone, Trash, UserCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Popup from "../PopUp";

const CardDependente = ({ termoPesquisa, dependentes, removerDependente, onClickDependente }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [dependenteSelecionado, setDependenteSelecionado] = useState(null);

    const dependentesFiltrados = (Array.isArray(dependentes) ? dependentes : []).filter(dep => {
        if (!dep) return false;

        const searchTerm = termoPesquisa?.toLowerCase() || '';
        return (
            (dep.nome?.toLowerCase().includes(searchTerm)) ||
            (dep.principioAtivo?.toLowerCase().includes(searchTerm)) ||
            (dep.dosagem?.toLowerCase().includes(searchTerm))
        );
    });

    const texto = {
        h2: "Tem certeza que quer excluir?",
        sub: "Excluir fará com que você perca seus dados."
    };

    return (
        <div className="p-6">
            <div className="flex flex-wrap max-h-[500px] gap-5 justify-center overflow-y-auto p-2 border border-cyan-200 rounded-lg">
                {termoPesquisa && (
                    <p className="w-full text-center text-gray-500 text-sm mb-2">
                        {dependentesFiltrados.length} resultados para "{termoPesquisa}"
                    </p>
                )}

                {dependentesFiltrados.length === 0 ? (
                    <div className="w-full text-center py-10 text-gray-500">
                        {termoPesquisa
                            ? "Nenhum dependente encontrado com esse termo"
                            : "Nenhum dependente cadastrado"}
                    </div>
                ) : (
                    dependentesFiltrados.map((dep) => (
                        <div
                            key={dep.id}
                            className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 flex flex-col items-center w-64 hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-center">{dep.nome}</h3>
                            <div className="flex items-center gap-2 text-gray-700 mt-2">
                                <Phone size={16} className="text-cyan-500" />
                                <span>{dep.telefone}</span>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDependenteSelecionado(dep);
                                        setOpen(true);
                                    }}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    title="Excluir dependente"
                                >
                                    <Trash size={16} />
                                </button>
                                <button
                                    className="bg-cyan-500 text-white p-2 rounded-full hover:bg-cyan-600 transition-colors"
                                    onClick={() => onClickDependente(dep.id)}
                                    title="Ver detalhes"
                                >
                                    <UserCircleIcon size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Popup
                open={open}
                setOpen={setOpen}
                botao1={{
                    label: "Excluir",
                    funcao: () => {
                        if (dependenteSelecionado) {
                            removerDependente(dependenteSelecionado.id);
                            setOpen(false);
                        }
                    }
                }}
                texto={texto}
            />
        </div>
    );
};

export default CardDependente;