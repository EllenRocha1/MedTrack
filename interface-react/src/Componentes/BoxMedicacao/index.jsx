import api from "../../Service/api";

const BoxMedicacao = ({ medicacoes, termoPesquisa }) => {
    // Filtro mais completo e seguro
    const medicacoesFiltradas = (Array.isArray(medicacoes) ? medicacoes : []).filter(med => {
        if (!med) return false;

        const searchTerm = termoPesquisa?.toLowerCase() || '';
        return (
            (med.nome?.toLowerCase().includes(searchTerm)) ||
            (med.principioAtivo?.toLowerCase().includes(searchTerm)) ||
            (med.dosagem?.toLowerCase().includes(searchTerm))
        );
    });



    async function remover(id) {
        console.log(id)
        try {
            await api.delete(`http://localhost:8081/medicamentos/deletar/${id}`);
            console.log("Medicação removida com sucesso");
            window.location.reload()
        } catch (error) {
            console.error("Erro ao remover medicação", error);
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
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg">{med.nome}</h2>
                            {med.principioAtivo && (
                                <p className="text-gray-600 text-sm">{med.principioAtivo}</p>
                            )}
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
        </div>
    );
};

export default BoxMedicacao;