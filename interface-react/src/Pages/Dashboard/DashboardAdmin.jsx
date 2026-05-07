import Sidebar from "../../Componentes/Sidebar";
import { getUserRole, getUserInfo } from "../../Componentes/Auth/AuthToken";
import { useEffect, useState } from "react";
import api from "../../Service/api";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiAlertCircle, FiActivity, FiPackage } from "react-icons/fi";

const DashboardAdmin = () => {
    const userInfo = getUserInfo();
    const isAdmin = getUserRole() === "ADMINISTRADOR";
    const [sidebarExpandida, setSidebarExpandida] = useState(true);
    const [dependentes, setDependentes] = useState([]);
    const [alertas, setAlertas] = useState([]);
    const [stats, setStats] = useState({
        totalDependentes: 0,
        alertasCriticos: 0,
        totalMedicamentos: 0,
        reposicoesPendentes: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const deps = await api.get("http://localhost:8081/dependentes/buscar/todos");

                let totalMed = 0;
                let totalCrit = 0;
                const alertasEncontrados = [];
                const linhas = [];

                await Promise.all(deps.map(async (dep) => {
                    try {
                        const meds = await api.get(`http://localhost:8081/medicamentos/todos/dependente/${dep.id}`);
                        totalMed += meds.length;

                        const criticos = meds.filter(m => m.estoque?.estoqueBaixo);
                        totalCrit += criticos.length;

                        criticos.forEach(m => alertasEncontrados.push({
                            nome: m.nome,
                            dep: dep.nome,
                            qtd: m.estoque.quantidadeAtual
                        }));

                        linhas.push({ dep, meds: meds.length, criticos: criticos.length });
                    } catch {
                        linhas.push({ dep, meds: 0, criticos: 0 });
                    }
                }));

                setDependentes(linhas);
                setAlertas(alertasEncontrados);
                setStats({
                    totalDependentes: deps.length,
                    alertasCriticos: totalCrit,
                    totalMedicamentos: totalMed,
                    reposicoesPendentes: totalCrit
                });
            } catch (error) {
                console.error("Erro ao carregar dashboard admin:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDados();
    }, []);

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans">
            <Sidebar
                type={isAdmin}
                expandida={sidebarExpandida}
                setExpandida={setSidebarExpandida}
            />

            <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarExpandida ? "ml-0" : "ml-16"}`}>
                <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Painel de Gestão</h1>
                        <p className="text-slate-500 text-sm">Monitoramento em tempo real dos dependentes</p>
                    </div>
                    <div className="text-right">
                        <span className="block font-medium text-slate-700">{userInfo.nome}</span>
                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full uppercase tracking-wider">Administrador</span>
                    </div>
                </header>

                <main className="p-8 space-y-8">
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard icon={<FiUsers />} label="Dependentes" value={stats.totalDependentes} color="text-blue-600" bg="bg-blue-50" />
                        <StatCard icon={<FiAlertCircle />} label="Alertas Críticos" value={stats.alertasCriticos} color="text-red-600" bg="bg-red-50" />
                        <StatCard icon={<FiActivity />} label="Medicamentos" value={stats.totalMedicamentos} color="text-emerald-600" bg="bg-emerald-50" />
                        <StatCard icon={<FiPackage />} label="Reposições Pendentes" value={stats.reposicoesPendentes} color="text-amber-600" bg="bg-amber-50" />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-semibold text-slate-800 text-lg">Status de Dependentes</h3>
                            </div>
                            <div className="p-0">
                                {loading ? (
                                    <p className="text-center text-slate-400 py-8 text-sm">Carregando...</p>
                                ) : dependentes.length === 0 ? (
                                    <p className="text-center text-slate-400 py-8 text-sm">Nenhum dependente cadastrado.</p>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                            <tr>
                                                <th className="p-4 font-medium">Paciente</th>
                                                <th className="p-4 font-medium text-center">Medicamentos</th>
                                                <th className="p-4 font-medium">Status</th>
                                                <th className="p-4 font-medium text-right">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dependentes.map(({ dep, meds, criticos }) => (
                                                <tr key={dep.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4">
                                                        <p className="font-medium text-slate-700">{dep.nome}</p>
                                                        <p className="text-xs text-slate-400">{dep.email}</p>
                                                    </td>
                                                    <td className="p-4 text-center text-slate-600">{meds}</td>
                                                    <td className="p-4">
                                                        {criticos > 0 ? (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Crítico</span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">OK</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => navigate(`/perfil_dependente/${dep.id}`)}
                                                            className="text-cyan-600 hover:underline text-sm font-medium">
                                                            Detalhes
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>

                        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-800 text-lg mb-4">Reposições Urgentes</h3>
                            <div className="space-y-4">
                                {loading ? (
                                    <p className="text-center text-slate-400 py-8 text-sm">Carregando...</p>
                                ) : alertas.length === 0 ? (
                                    <p className="text-center text-slate-400 text-sm py-4">Nenhuma reposição urgente 🎉</p>
                                ) : (
                                    alertas.map((a, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-red-50 border border-red-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-red-800">{a.nome}</p>
                                                <p className="text-xs text-red-600">Paciente: {a.dep}</p>
                                            </div>
                                            <span className="text-red-700 font-bold">{a.qtd} un.</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color, bg }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${bg} ${color} text-2xl`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    </div>
);

export default DashboardAdmin;