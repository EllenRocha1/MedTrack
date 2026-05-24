import api, { BACKEND_URL } from "../../Service/api";
import { FiImage, FiUpload } from "react-icons/fi";
import { useState } from "react";

const BoxMedicacao = ({ medicacoes, termoPesquisa }) => {
    const [medicacaoSelecionada, setMedicacaoSelecionada] = useState(null);
    const [imagemPreview, setImagemPreview] = useState("");
    const [imagemArquivo, setImagemArquivo] = useState(null);
    const [salvandoImagem, setSalvandoImagem] = useState(false);
    const [erroImagem, setErroImagem] = useState("");

    const medicacoesFiltradas = (Array.isArray(medicacoes) ? medicacoes : []).filter(med => {
        if (!med) return false;

        const searchTerm = termoPesquisa?.toLowerCase() || "";
        return (
            (med.nome?.toLowerCase().includes(searchTerm)) ||
            (med.principioAtivo?.toLowerCase().includes(searchTerm)) ||
            (med.dosagem?.toLowerCase().includes(searchTerm))
        );
    });

    async function remover(id) {
        try {
            await api.delete(`${BACKEND_URL}/medicamentos/deletar/${id}`);
            window.location.reload();
        } catch (error) {
            console.error("Erro ao remover medicacao", error);
        }
    }

    function abrirDialogImagem(med) {
        setMedicacaoSelecionada(med);
        setImagemPreview(med.imagemUrl || "");
        setImagemArquivo(null);
        setErroImagem("");
    }

    function fecharDialogImagem() {
        if (salvandoImagem) return;
        setMedicacaoSelecionada(null);
        setImagemPreview("");
        setImagemArquivo(null);
        setErroImagem("");
    }

    function selecionarImagem(event) {
        const arquivo = event.target.files?.[0] || null;
        setImagemArquivo(arquivo);
        setErroImagem("");

        if (arquivo) {
            setImagemPreview(URL.createObjectURL(arquivo));
        } else {
            setImagemPreview(medicacaoSelecionada?.imagemUrl || "");
        }
    }

    async function atualizarImagem() {
        if (!medicacaoSelecionada) return;

        if (!imagemArquivo) {
            setErroImagem("Selecione uma imagem PNG ou JPEG.");
            return;
        }

        try {
            setSalvandoImagem(true);
            setErroImagem("");

            const dadosImagem = new FormData();
            dadosImagem.append("imagem", imagemArquivo);
            await api.postForm(`${BACKEND_URL}/medicamentos/${medicacaoSelecionada.id}/imagem`, dadosImagem);

            window.location.reload();
        } catch (error) {
            console.error("Erro ao atualizar imagem do medicamento", error);
            setErroImagem("Nao foi possivel atualizar a imagem.");
        } finally {
            setSalvandoImagem(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {termoPesquisa && (
                <p className="text-gray-500 text-sm">
                    {medicacoesFiltradas.length} resultados para "{termoPesquisa}"
                </p>
            )}

            {medicacoesFiltradas.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    {termoPesquisa
                        ? "Nenhum medicamento encontrado com esse termo"
                        : "Nenhum medicamento cadastrado"}
                </div>
            ) : (
                medicacoesFiltradas.map((med) => (
                    <div key={med.id} className="flex border px-6 py-4 justify-between items-center rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            {med.imagemUrl ? (
                                <button
                                    type="button"
                                    onClick={() => abrirDialogImagem(med)}
                                    className="w-14 h-14 rounded-md border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    aria-label={`Editar imagem de ${med.nome}`}
                                >
                                    <img
                                        src={med.imagemUrl}
                                        alt={med.nome ? `Imagem de ${med.nome}` : "Imagem do medicamento"}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => abrirDialogImagem(med)}
                                    className="w-14 h-14 rounded-md border border-gray-200 bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    aria-label={`Adicionar imagem para ${med.nome}`}
                                >
                                    <FiImage size={24} />
                                </button>
                            )}
                            <div className="min-w-0">
                                <h2 className="font-semibold text-lg truncate">{med.nome}</h2>
                                {med.principioAtivo && (
                                    <p className="text-gray-600 text-sm truncate">{med.principioAtivo}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-gray-700">{med.dosagem}</p>
                            <button
                                onClick={() => remover(med.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))
            )}

            {medicacaoSelecionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Imagem do medicamento</h3>
                                <p className="text-sm text-gray-500">{medicacaoSelecionada.nome}</p>
                            </div>
                            <button
                                type="button"
                                onClick={fecharDialogImagem}
                                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                                aria-label="Fechar"
                            >
                                x
                            </button>
                        </div>

                        <div className="mt-5 flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
                            {imagemPreview ? (
                                <img
                                    src={imagemPreview}
                                    alt={medicacaoSelecionada.nome ? `Imagem de ${medicacaoSelecionada.nome}` : "Imagem do medicamento"}
                                    className="max-h-80 w-full rounded-md object-contain"
                                />
                            ) : (
                                <div className="flex h-56 w-full items-center justify-center rounded-md bg-blue-50 text-blue-700">
                                    <FiImage size={48} />
                                </div>
                            )}
                        </div>

                        <label className="mt-5 block text-sm font-medium text-gray-700" htmlFor="imagemMedicamentoArquivo">
                            Nova imagem
                        </label>
                        <div className="mt-2">
                            <input
                                id="imagemMedicamentoArquivo"
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={selecionarImagem}
                                className="sr-only"
                            />
                            <label
                                htmlFor="imagemMedicamentoArquivo"
                                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-blue-300 bg-blue-50 p-3 text-blue-700 transition hover:border-blue-500 hover:bg-blue-100"
                            >
                                <span className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-white text-blue-600 shadow-sm">
                                        <FiImage size={20} />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold">
                                            {imagemArquivo?.name || "Selecionar nova imagem"}
                                        </span>
                                        <span className="block text-xs text-blue-500">
                                            PNG ou JPEG
                                        </span>
                                    </span>
                                </span>
                                <FiUpload className="flex-shrink-0" size={20} />
                            </label>
                        </div>

                        {erroImagem && (
                            <p className="mt-3 text-sm text-red-600">{erroImagem}</p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={fecharDialogImagem}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                disabled={salvandoImagem}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={atualizarImagem}
                                className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-60"
                                disabled={salvandoImagem}
                            >
                                {salvandoImagem ? "Salvando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoxMedicacao;
