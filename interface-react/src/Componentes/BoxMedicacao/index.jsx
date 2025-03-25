import api from "../../Service/api";

const BoxMedicacao = ({ medicacoes , termoPesquisa}) => {


    const medicacoesFiltradas = (Array.isArray(medicacoes) ? medicacoes : []).filter(med =>
        med.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
    );

    function remover(id) {
        api.delete(`/medicacoes/${id}`)
            .then(() => console.log("Medicação removida com sucesso"))
            .catch(error => console.error("Erro ao remover medicação", error));
    }

    return (
        <div className="flex flex-col gap-2">
            {medicacoesFiltradas.map((med) => (
                <div key={med.id} className="flex border px-10 py-10 justify-between">  {/* Adicionando a chave para evitar warnings do React */}
                    <h2>{med.nome}</h2>
                    <p>{med.dosagem}</p>
                </div>
            ))}
        </div>
    );
};

export default BoxMedicacao;
