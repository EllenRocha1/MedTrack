import BoxMedicacao from "../BoxMedicacao";
import Botao from "../Botao";



const Medicacoes = ({ termoPesquisa }) => {
    const medicamentos = [
        { nome: "Medicamento 1", quantidade: "2 comprimidos" },
        { nome: "Medicamento 2", quantidade: "1 cápsula" }
    ];

    const medicamentosFiltrados = medicamentos.filter((medicamento) =>
        medicamento.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-3 w-full h-screen border border-cyan-300 rounded-lg p-10">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Lista de Medicações</h2>
                <Botao label={"Novo Medicamento"} destino={"/cadastro_medicamento"} />
            </div>
            <BoxMedicacao props={medicamentosFiltrados} />
        </div>
    );
};

export default Medicacoes;
