import { useMemo, useState } from "react";
import { FiImage } from "react-icons/fi";

const formatarData = (data) => {
    if (!data) return "-";
    return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
};

const formatarHora = (hora) => {
    if (!hora) return "-";
    return hora.substring(0, 5);
};

const RelatorioMedicacao = ({ dados }) => {
    const [medicamentoSelecionadoId, setMedicamentoSelecionadoId] = useState(null);
    const [imagemExpandida, setImagemExpandida] = useState(null);

    const registros = useMemo(() => dados.registros || [], [dados.registros]);
    const medicamentoSelecionado = useMemo(() => {
        if (registros.length === 0) return null;
        return registros.find((registro) => registro.id === medicamentoSelecionadoId) || registros[0];
    }, [registros, medicamentoSelecionadoId]);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-cyan-500 mb-4">Relatório de Medicação</h1>

            <div className="mb-6">
                <p><strong>Nome do Paciente:</strong> {dados.nome || "Não informado"}</p>
                <p><strong>Período:</strong> {dados.semana || "Não informado"}</p>
            </div>

            {registros.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    Nenhum medicamento encontrado.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-3">
                        {registros.map((registro) => (
                            <button
                                key={registro.id}
                                type="button"
                                onClick={() => setMedicamentoSelecionadoId(registro.id)}
                                className={`w-full flex items-center gap-4 rounded-lg border p-4 text-left transition ${
                                    medicamentoSelecionado?.id === registro.id
                                        ? "border-cyan-500 bg-cyan-50"
                                        : "border-gray-200 hover:border-cyan-300"
                                }`}
                            >
                                {registro.imagemUrl ? (
                                    <img
                                        src={registro.imagemUrl}
                                        alt={`Imagem de ${registro.nome}`}
                                        className="h-14 w-14 rounded-md object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="h-14 w-14 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center border border-gray-200">
                                        <FiImage size={22} />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">{registro.nome}</p>
                                    <p className="text-sm text-gray-500 truncate">{registro.dosagem}</p>
                                    <p className="text-xs text-cyan-700 mt-1">
                                        {registro.confirmacoes.length} confirmações
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-2 rounded-lg border border-gray-200 p-5">
                        {medicamentoSelecionado && (
                            <>
                                <div className="flex gap-4 items-start border-b pb-4">
                                    {medicamentoSelecionado.imagemUrl ? (
                                        <button
                                            type="button"
                                            onClick={() => setImagemExpandida(medicamentoSelecionado.imagemUrl)}
                                            className="h-24 w-24 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0"
                                        >
                                            <img
                                                src={medicamentoSelecionado.imagemUrl}
                                                alt={`Imagem de ${medicamentoSelecionado.nome}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ) : (
                                        <div className="h-24 w-24 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center border border-gray-200 flex-shrink-0">
                                            <FiImage size={32} />
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{medicamentoSelecionado.nome}</h2>
                                        <p className="text-sm text-gray-600">{medicamentoSelecionado.principioAtivo}</p>
                                        <p className="text-sm text-gray-600 mt-1">Dose: {medicamentoSelecionado.dosagem}</p>
                                        <p className="text-sm text-gray-600">Horários: {medicamentoSelecionado.horarios}</p>
                                        <p className="text-sm text-gray-600">
                                            Uso contínuo: {medicamentoSelecionado.usoContinuo ? "Sim" : "Não"}
                                        </p>
                                        <p className="text-sm text-gray-500 italic mt-2">{medicamentoSelecionado.observacoes}</p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <h3 className="font-semibold text-gray-800">Histórico de confirmações</h3>
                                    {medicamentoSelecionado.confirmacoes.length > 0 ? (
                                        medicamentoSelecionado.confirmacoes.map((confirmacao) => (
                                            <div key={confirmacao.id} className="rounded-lg border border-gray-200 p-4">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {formatarData(confirmacao.data)} às {formatarHora(confirmacao.horario)}
                                                        </p>
                                                        <p className={confirmacao.foiTomado ? "text-green-700" : "text-red-600"}>
                                                            {confirmacao.foiTomado ? "Tomado" : "Não tomado"}
                                                        </p>
                                                    </div>

                                                    {confirmacao.comprovanteImagemUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setImagemExpandida(confirmacao.comprovanteImagemUrl)}
                                                            className="h-16 w-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50"
                                                        >
                                                            <img
                                                                src={confirmacao.comprovanteImagemUrl}
                                                                alt="Comprovante da confirmação"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                                {confirmacao.observacao && (
                                                    <p className="mt-2 text-sm text-gray-600">{confirmacao.observacao}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Nenhuma confirmação registrada para este medicamento.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {imagemExpandida && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setImagemExpandida(null)}>
                    <div className="max-w-4xl max-h-[90vh] rounded-lg bg-white p-3 shadow-xl">
                        <img
                            src={imagemExpandida}
                            alt="Imagem ampliada"
                            className="max-h-[84vh] w-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelatorioMedicacao;
