import RelatorioMedicacao from "../../Componentes/HistoricoMedicacoes";
import Sidebar from "../../Componentes/Sidebar";
import { useEffect, useState } from "react";
import api, { BACKEND_URL } from "../../Service/api";
import { getUserInfo, getUserRole } from "../../Componentes/Auth/AuthToken";
import { useParams } from "react-router-dom";

const formatarHorarios = (frequenciaUso) => {
    if (!frequenciaUso) return "-";
    if (frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS") {
        const horarios = frequenciaUso.horariosEspecificos;
        if (horarios && horarios.length > 0) return horarios.map(h => h.substring(0, 5)).join(", ");
        if (frequenciaUso.primeiroHorario) return frequenciaUso.primeiroHorario.substring(0, 5);
    }
    if (frequenciaUso.frequenciaUsoTipo === "INTERVALO_ENTRE_DOSES") {
        const inicio = frequenciaUso.primeiroHorario?.substring(0, 5) || "-";
        return `A cada ${frequenciaUso.intervaloHoras}h (inicio: ${inicio})`;
    }
    return "-";
};

const PaginaHistoricoDependentes = () => {
    const userRole = getUserRole();
    const userInfo = getUserInfo();
    const { id } = useParams();
    const type = userRole !== "PESSOAL";

    const [dados, setDados] = useState({ nome: "", semana: "", registros: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDados = async () => {
            try {
                let medicamentos = [];
                let confirmacoes = [];
                let nomePaciente = "";

                if (userRole === "PESSOAL") {
                    medicamentos = await api.get(`${BACKEND_URL}/medicamentos/todos/${userInfo.id}`);
                    confirmacoes = await api.get(`${BACKEND_URL}/api/confirmacao/usuario/${userInfo.id}`);
                    nomePaciente = userInfo.nome;
                } else if (userRole === "ADMINISTRADOR") {
                    medicamentos = await api.get(`${BACKEND_URL}/medicamentos/todos/dependente/${id}`);
                    confirmacoes = await api.get(`${BACKEND_URL}/api/confirmacao/dependente/${id}`);
                    const dependente = await api.get(`${BACKEND_URL}/dependentes/buscar/${id}`);
                    nomePaciente = dependente.nome;
                }

                const registros = medicamentos.map(m => ({
                    id: m.id,
                    nome: m.nome,
                    principioAtivo: m.principioAtivo,
                    dosagem: m.dosagem,
                    imagemUrl: m.imagemUrl,
                    horarios: formatarHorarios(m.frequenciaUso),
                    usoContinuo: m.frequenciaUso?.usoContinuo,
                    observacoes: m.observacoes || "-",
                    confirmacoes: confirmacoes.filter(c => c.medicamentoId === m.id)
                }));

                setDados({
                    nome: nomePaciente,
                    semana: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
                    registros
                });

            } catch (err) {
                console.error("Erro ao buscar:", err);
                setError(err.message);
            }
        };

        if (userRole) fetchDados();
    }, [userRole, id, userInfo.id, userInfo.nome]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <Sidebar className="w-64" type={type} />
                <div className="flex-1 p-4 transition-all duration-300">
                    {error ? (
                        <p className="text-red-500 p-4">Erro ao carregar dados: {error}</p>
                    ) : (
                        <RelatorioMedicacao dados={dados} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaginaHistoricoDependentes;
